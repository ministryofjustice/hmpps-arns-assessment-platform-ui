import nunjucks from 'nunjucks'

export default class JourneyTemplateLoader extends nunjucks.FileSystemLoader {
  private static readonly journeyNamespace = 'sentence-plan/'

  constructor() {
    super([
      'server/forms/sentence-plan',
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ])
  }

  static createEnvironment(): nunjucks.Environment {
    return new nunjucks.Environment(new JourneyTemplateLoader(), { autoescape: true })
  }

  getSource(name: string): nunjucks.LoaderSource {
    const templateName = name.startsWith(JourneyTemplateLoader.journeyNamespace)
      ? name.slice(JourneyTemplateLoader.journeyNamespace.length)
      : name

    return super.getSource(templateName)
  }
}
