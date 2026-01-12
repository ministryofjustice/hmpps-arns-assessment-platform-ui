import { RestClient, asSystem, AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { TestInfo } from '@playwright/test'
import type { Commands } from '../../../server/interfaces/aap-api/command'
import type { CommandsResponse } from '../../../server/interfaces/aap-api/response'
import type { CommandResults } from '../../../server/interfaces/aap-api/commandResult'
import { noopLogger } from './noopLogger'

export interface TestAapApiClientConfig {
  baseUrl: string
  authenticationClient: AuthenticationClient
  testInfo?: TestInfo
}

/**
 * API client for test data setup.
 * Extends hmpps-rest-client for consistent HTTP handling and auth.
 * Optionally attaches request/response data to Playwright test reports.
 */
export class TestAapApiClient extends RestClient {
  private readonly testInfo?: TestInfo

  constructor(config: TestAapApiClientConfig) {
    super(
      'Test AAP API Client',
      {
        url: config.baseUrl,
        timeout: { response: 30000, deadline: 30000 },
        agent: new AgentConfig(30000),
      },
      noopLogger,
      config.authenticationClient,
    )
    this.testInfo = config.testInfo
  }

  /**
   * Execute a single command and return the typed result.
   */
  async executeCommand<T extends CommandResults>(command: Commands): Promise<T> {
    const [result] = await this.executeCommands(command)
    return result as T
  }

  /**
   * Execute multiple commands as a batch.
   * All commands succeed or fail together.
   */
  async executeCommands(...commands: Commands[]): Promise<CommandResults[]> {
    const commandTypes = commands.map(c => c.type).join(', ')

    try {
      const response: CommandsResponse = await this.post({ path: '/command', data: { commands } }, asSystem())

      // Check each command result for success
      const results = response.commands.map((cmd, i) => {
        if (!cmd.result?.success) {
          throw new Error(`Command ${commands[i].type} failed: ${cmd.result?.message}`)
        }

        return cmd.result
      })

      // Attach to test report for trace viewer
      if (this.testInfo) {
        await this.testInfo.attach(`TEST AAP API SUCCESS: ${commandTypes}`, {
          body: JSON.stringify(
            {
              commands: commands.map((cmd, i) => ({
                request: cmd,
                result: response.commands[i]?.result,
              })),
            },
            null,
            2,
          ),
          contentType: 'application/json',
        })
      }

      return results
    } catch (error) {
      if (this.testInfo) {
        await this.testInfo.attach(`TEST AAP API ERROR: ${commandTypes}`, {
          body: JSON.stringify(
            {
              commands,
              error,
            },
            null,
            2,
          ),
          contentType: 'application/json',
        })
      }

      throw error
    }
  }
}
