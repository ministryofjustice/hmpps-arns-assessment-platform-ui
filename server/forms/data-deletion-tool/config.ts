export const dataDeletionToolConfig = {
  enabled: (process.env.FORM_DATA_DELETION_TOOL_ENABLED ?? 'false') === 'true',
  environments: {
    local: {
      authenticationUrl: 'http:///hmpps-auth:9090/auth',
      apiUrl: 'http://aap-api:8080',
    },
    dev: {
      authenticationUrl: 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth',
      apiUrl: 'https://arns-assessment-platform-api-dev.hmpps.service.justice.gov.uk',
    },
    test: {
      authenticationUrl: 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth',
      apiUrl: 'https://arns-assessment-platform-api-test.hmpps.service.justice.gov.uk',
    },
    preprod: {
      authenticationUrl: 'https://sign-in-preprod.hmpps.service.justice.gov.uk/auth',
      apiUrl: 'https://arns-assessment-platform-api-preprod.hmpps.service.justice.gov.uk',
    },
    prod: {
      authenticationUrl: 'https://sign-in.hmpps.service.justice.gov.uk/auth',
      apiUrl: 'https://arns-assessment-platform-api.hmpps.service.justice.gov.uk',
    },
  },
} as const
