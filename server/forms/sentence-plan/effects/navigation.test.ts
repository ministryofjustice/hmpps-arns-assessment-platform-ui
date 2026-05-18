import fs from 'fs'
import path from 'path'
import { NAV_KEY_PATTERNS } from './navigation'

function findStepFiles(dir: string): string[] {
  const results: string[] = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      results.push(...findStepFiles(fullPath))
    } else if (entry.name === 'step.ts') {
      results.push(fullPath)
    }
  }

  return results
}

function extractStepPath(filePath: string): string | null {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/path:\s*'([^']+)'/)

  return match ? match[1] : null
}

function stripRouteParams(stepPath: string): string {
  return stepPath.replace(/\/:[^/]+/g, '')
}

describe('NAV_KEY_PATTERNS coverage', () => {
  it('should track every step in NAV_KEY_PATTERNS', () => {
    // Arrange
    const versionsDir = path.resolve(__dirname, '../versions/v1.0')
    const stepFiles = findStepFiles(versionsDir)
    const patternValues = Object.values(NAV_KEY_PATTERNS)

    // Act & Assert
    stepFiles.forEach(file => {
      const rawPath = extractStepPath(file)

      if (rawPath) {
        const strippedPath = stripRouteParams(rawPath)
        const isTracked = patternValues.some(pattern => pattern.includes(strippedPath))
        const relativePath = path.relative(versionsDir, file)

        if (!isTracked) {
          throw new Error(
            `Step "${relativePath}" (path: '${rawPath}') is not tracked in NAV_KEY_PATTERNS. ` +
              `Add a Nav key and pattern entry in effects/navigation.ts.`,
          )
        }

        expect(isTracked).toBe(true)
      }
    })
  })
})
