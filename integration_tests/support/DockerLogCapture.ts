import http from 'node:http'
import { promises as fs } from 'node:fs'

const DOCKER_SOCKET_PATH = '/var/run/docker.sock'
const DOCKER_API_VERSION = 'v1.43'
// eslint-disable-next-line no-control-regex
const ANSI_ESCAPE_CODE_PATTERN = /\u001B\[[0-?]*[ -/]*[@-~]/g

interface DockerResponse {
  statusCode: number
  body: Buffer
}

type DockerLogParseMode = 'empty' | 'multiplexed' | 'plain-text'

interface DockerLogCaptureOptions {
  readonly since?: Date
  readonly tail?: number
}

interface DockerSocketDebugInfo {
  exists: boolean
  isSocket: boolean
}

interface ContainerLookupResult {
  containerId?: string
  matchingContainerCount: number
  statusCode: number
}

export interface DockerLogCaptureDebugInfo {
  containerId?: string
  error?: string
  logsBodyLength?: number
  logsStatusCode?: number
  matchingContainerCount?: number
  parseMode?: DockerLogParseMode
  serviceName: string
  since?: string
  socket: DockerSocketDebugInfo
  tail?: number
}

export interface DockerLogCaptureResult {
  debugInfo: DockerLogCaptureDebugInfo
  logs: string
}

function dockerGet(path: string): Promise<DockerResponse> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        socketPath: DOCKER_SOCKET_PATH,
        path: `/${DOCKER_API_VERSION}${path}`,
        method: 'GET',
      },
      res => {
        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body: Buffer.concat(chunks) }))
      },
    )
    req.on('error', reject)
    req.end()
  })
}

/**
 * Docker logs API returns a multiplexed stream where each frame has:
 * - 1 byte: stream type (1=stdout, 2=stderr)
 * - 3 bytes: padding
 * - 4 bytes: big-endian uint32 payload length
 * - N bytes: payload
 */
function tryParseMultiplexedLogs(buffer: Buffer): string | undefined {
  const lines: string[] = []
  let offset = 0

  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) {
      return undefined
    }

    const streamType = buffer.readUInt8(offset)

    if (streamType < 1 || streamType > 3) {
      return undefined
    }

    const size = buffer.readUInt32BE(offset + 4)
    offset += 8

    if (offset + size > buffer.length) {
      return undefined
    }

    lines.push(buffer.subarray(offset, offset + size).toString('utf-8'))
    offset += size
  }

  return lines.join('')
}

function parseDockerLogs(buffer: Buffer): { logs: string; parseMode: DockerLogParseMode } {
  if (buffer.length === 0) {
    return { logs: '', parseMode: 'empty' }
  }

  const multiplexedLogs = tryParseMultiplexedLogs(buffer)

  if (multiplexedLogs !== undefined) {
    return { logs: multiplexedLogs, parseMode: 'multiplexed' }
  }

  // Some Docker environments return plain text log output rather than framed streams.
  return { logs: buffer.toString('utf-8'), parseMode: 'plain-text' }
}

function normaliseDockerTimestamp(timestamp: string): string | undefined {
  const dockerTimestampMatch = timestamp.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/)

  if (!dockerTimestampMatch) {
    return undefined
  }

  const [, baseTimestamp, fractionalSeconds = '', timezoneOffset] = dockerTimestampMatch
  const milliseconds = fractionalSeconds.slice(1, 4).padEnd(3, '0') || '000'

  return `${baseTimestamp}.${milliseconds}${timezoneOffset}`
}

function parseDockerTimestamp(timestamp: string): number | undefined {
  const normalisedTimestamp = normaliseDockerTimestamp(timestamp)

  if (!normalisedTimestamp) {
    return undefined
  }

  const parsedTimestamp = Date.parse(normalisedTimestamp)

  if (Number.isNaN(parsedTimestamp)) {
    return undefined
  }

  return parsedTimestamp
}

function stripAnsiEscapeCodes(logs: string): string {
  return logs.replace(ANSI_ESCAPE_CODE_PATTERN, '')
}

function filterLogsSince(logs: string, since: Date): string {
  const sinceTimestamp = since.getTime()
  const hasTrailingNewline = logs.endsWith('\n')

  const filteredLines = logs
    .split('\n')
    .filter(line => {
      if (line.length === 0) {
        return false
      }

      const firstSpaceIndex = line.indexOf(' ')

      if (firstSpaceIndex === -1) {
        return true
      }

      const dockerTimestamp = line.slice(0, firstSpaceIndex)
      const parsedTimestamp = parseDockerTimestamp(dockerTimestamp)

      if (parsedTimestamp === undefined) {
        return true
      }

      return parsedTimestamp >= sinceTimestamp
    })

  if (filteredLines.length === 0) {
    return ''
  }

  return `${filteredLines.join('\n')}${hasTrailingNewline ? '\n' : ''}`
}

function buildLogsPath(containerId: string, options: DockerLogCaptureOptions): string {
  const searchParams = new URLSearchParams({
    stderr: '1',
    stdout: '1',
    timestamps: '1',
  })

  if (options.since) {
    searchParams.set('since', String(Math.floor(options.since.getTime() / 1000)))
  } else {
    searchParams.set('tail', String(options.tail ?? 200))
  }

  return `/containers/${containerId}/logs?${searchParams.toString()}`
}

async function getDockerSocketDebugInfo(): Promise<DockerSocketDebugInfo> {
  try {
    const socketStats = await fs.stat(DOCKER_SOCKET_PATH)

    return {
      exists: true,
      isSocket: socketStats.isSocket(),
    }
  } catch {
    return {
      exists: false,
      isSocket: false,
    }
  }
}

async function findContainerId(serviceName: string): Promise<ContainerLookupResult> {
  const filters = JSON.stringify({ label: [`com.docker.compose.service=${serviceName}`] })
  const { statusCode, body } = await dockerGet(`/containers/json?filters=${encodeURIComponent(filters)}`)

  if (statusCode !== 200) {
    return {
      matchingContainerCount: 0,
      statusCode,
    }
  }

  const containers = JSON.parse(body.toString('utf-8')) as Array<{ Id?: string }>

  return {
    containerId: containers[0]?.Id,
    matchingContainerCount: containers.length,
    statusCode,
  }
}

export async function captureContainerLogs(
  serviceName: string,
  options: DockerLogCaptureOptions = {},
): Promise<DockerLogCaptureResult> {
  const debugInfo: DockerLogCaptureDebugInfo = {
    serviceName,
    since: options.since?.toISOString(),
    socket: await getDockerSocketDebugInfo(),
    tail: options.since ? undefined : (options.tail ?? 200),
  }

  try {
    const containerLookupResult = await findContainerId(serviceName)
    debugInfo.containerId = containerLookupResult.containerId
    debugInfo.matchingContainerCount = containerLookupResult.matchingContainerCount

    if (containerLookupResult.statusCode !== 200) {
      debugInfo.logsStatusCode = containerLookupResult.statusCode

      return {
        debugInfo,
        logs: `[DockerLogCapture] Docker container lookup returned status ${containerLookupResult.statusCode}`,
      }
    }

    if (!containerLookupResult.containerId) {
      return {
        debugInfo,
        logs: `[DockerLogCapture] No container found for service: ${serviceName}`,
      }
    }

    const { statusCode, body } = await dockerGet(buildLogsPath(containerLookupResult.containerId, options))
    debugInfo.logsBodyLength = body.length
    debugInfo.logsStatusCode = statusCode

    if (statusCode !== 200) {
      return {
        debugInfo,
        logs: `[DockerLogCapture] Docker logs API returned status ${statusCode}`,
      }
    }

    const { logs: rawLogs, parseMode } = parseDockerLogs(body)
    debugInfo.parseMode = parseMode
    const scopedLogs = options.since ? filterLogsSince(rawLogs, options.since) : rawLogs
    const logs = stripAnsiEscapeCodes(scopedLogs)

    if (logs.length === 0) {
      return {
        debugInfo,
        logs: `[DockerLogCapture] No logs returned for service: ${serviceName}`,
      }
    }

    return {
      debugInfo,
      logs,
    }
  } catch (error) {
    debugInfo.error = error instanceof Error ? error.message : String(error)

    return {
      debugInfo,
      logs: `[DockerLogCapture] ${debugInfo.error}`,
    }
  }
}
