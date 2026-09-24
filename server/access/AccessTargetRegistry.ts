export interface AccessTarget {
  readonly entryPath: string
}

class AccessTargetRegistry {
  private readonly accessTargets = new Map<string, AccessTarget>([
    ['sentence-plan', { entryPath: '/sentence-plan' }],
    ['strengths-and-needs', { entryPath: '/strengths-and-needs' }],
  ])

  get(service: string): AccessTarget | undefined {
    return this.accessTargets.get(service)
  }
}

export default new AccessTargetRegistry()
