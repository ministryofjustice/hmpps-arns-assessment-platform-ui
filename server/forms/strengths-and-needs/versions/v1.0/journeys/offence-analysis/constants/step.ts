export const Step = {
  offence_analysis: {
    code: 'offence_analysis',
    path: 'offence-analysis',
  },
  offence_analysis_involved_parties: {
    code: 'offence_analysis_involved_parties',
    path: 'offence-analysis-involved-parties',
  },
  offence_analysis_impact: {
    code: 'offence_analysis_impact',
    path: 'offence-analysis-impact',
  },
  offence_analysis_summary: {
    code: 'offence_analysis_summary',
    path: 'offence-analysis-summary',
  },
  offence_analysis_victim: {
    code: 'offence_analysis_victim',
    path: 'offence-analysis-victim/create',
  },
  offence_analysis_victim_edit: {
    code: 'offence_analysis_victim_edit',
    path: 'offence-analysis-victim/edit/%1',
    templatePath: 'offence-analysis-victim/edit/:itemId',
  },
  offence_analysis_victim_delete: {
    code: 'offence-analysis-victim_delete',
    path: 'offence-analysis-victim/delete/%1',
    templatePath: 'offence-analysis-victim/delete/:itemId',
  },
  offence_analysis_victim_summary: {
    code: 'offence_analysis_victim_summary',
    path: 'offence-analysis-victim-summary',
  },
  offence_analysis_analysis: {
    code: 'offence_analysis_analysis',
    path: 'offence-analysis-analysis',
  },
} as const
