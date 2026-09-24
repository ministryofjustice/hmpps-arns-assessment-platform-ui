const { ESBuildManager, ServerManager } = require('./utils')

function main() {
  const args = process.argv
  const isWatchMode = args.includes('--watch')
  const isAssembly = args.includes('--assembly')

  const serverManager = new ServerManager()
  const esbuildManager = new ESBuildManager({
    onBuildComplete: () => serverManager.restart(),
  })

  esbuildManager.start({ isAssembly, isWatchMode })
}

main()
