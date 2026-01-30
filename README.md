# HMPPS ARNS Assessment Platform UI

[![repo standards badge](https://img.shields.io/endpoint?labelColor=231f20&color=005ea5&style=flat&label=MoJ%20Compliant&url=https%3A%2F%2Foperations-engineering-reports-prod.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fendpoint%2Fhmpps-arns-assessment-platform-ui&logo=data:image/png;base64,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)](https://operations-engineering-reports-prod.cloud-platform.service.justice.gov.uk/public-report/hmpps-arns-assessment-platform-ui)
[![Docker Repository on ghcr](https://img.shields.io/badge/ghcr.io-repository-2496ED.svg?logo=docker)](https://ghcr.io/ministryofjustice/hmpps-arns-assessment-platform-ui)

The ARNS Assessment Platform (AAP) is a strategic solution designed to transform how ARNS assessment forms are built
and maintained across the justice system, providing a unified, scalable foundation for all ARNS requirements.

## About ARNS Assessment Platform

The AAP emerges from the need to modernise the ARNS practices within the justice system. It provides:

- **A declarative form engine**: Enable rapid assessment development through configuration rather than code
- **A unified frontend interface**: Ensure consistent user experience across all assessment types
- **A unified backend with versioned datastore**: Provide a single consistent access point for downstream services
with advanced data versioning

## Key Technologies

- **Form Engine**: Declarative form system with two-phase processing (compilation and runtime)
- **Runtime**: Node.js with Express
- **Frameworks**: GOV.UK Design System with Nunjucks templating
- **Testing**: Jest for unit tests, Playwright for E2E testing

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js v22+ (for local development)
- Make

### Development Setup

The project uses containerised development with all commands available through the Makefile:

```bash
# Build the development environment and install dependencies
make dev-build

# Start the development server with hot-reload (port 3000)
# Remote debugger available on port 9229
make dev-up

# View all available commands
make help
```

The application will be available at http://localhost:3000 with HMPPS Auth running on http://localhost:9090

### Common Development Commands

```bash
# Code Quality
make lint                    # Run ESLint
make lint-fix                # Auto-fix linting issues

# Container Management
make down                    # Stop all containers
make clean                   # Clean up containers and volumes
make update                  # Update container images
```

## Project Structure

```
hmpps-arns-assessment-platform-ui/
├── packages/
│   └── form-engine/        # Core form engine package
│       ├── src/
│       │   ├── core/       # AST, runtime, validation logic
│       │   ├── registry/   # Components, conditions, transformers
│       │   └── form/       # Form builders and types
│       └── docs/           # Form engine documentation
├── server/                 # Express application
│   ├── forms/              # Form configurations
│   ├── middleware/         # Auth, security, session handling
│   └── services/           # Business logic and API clients
├── integration_tests/      # Playwright E2E tests
├── docker/                 # Docker compose configurations
└── helm_deploy/            # Kubernetes deployment configs
```

## Form Engine Architecture

The form engine operates in two distinct phases:

### Compilation Phase (Build Time)
1. **Validation** - Verify form configurations match expected interfaces
2. **Transformation** - Parse JSON into typed Abstract Syntax Tree
3. **Registration** - Assign unique IDs and create O(1) lookup registry
4. **Dependency Analysis** - Build directed graph and detect circular dependencies
5. **Optimisation** - Generate pre-compiled lambda functions

### Runtime Phase (Request Time)
- Leverages pre-compiled AST for efficient evaluation of multi-level dependencies
- Provides Express routing for Form elements.


## Testing

### Prerequisites
```bash
npm i
npx playwright install
```

### Running Tests
```bash
make test                   # Run unit tests
make e2e-ci                 # Run Playwright tests in Docker container against application in Docker
make dev-up && make e2e-ui  # Run Playwright tests locally against application in Docker
```

### Testing Types

#### Integration Tests
Playwright [assertion tests](https://playwright.dev/docs/writing-tests#first-test) to check behaviour in the browser.

Key Scenarios:
- Navigation
- Validation
- Functional behaviour

*Example:* [createGoal.spec.ts](integration_tests/specs/sentencePlan/createGoal.spec.ts)

#### Snapshot Tests
Playwright [snapshot tests](https://playwright.dev/docs/aria-snapshots) you can assert the accessibility tree of a page.

Key Scenarios:
- Structural checks for complex UI components
- Page content displayed on load

```js
await expect('#main-content').toMatchAriaSnapshot(`
    - paragraph:
        - strong: Agreement updated
    - separator
`)
```

*Full Example:* [planHistory.agreements.spec.ts](integration_tests/specs/sentencePlan/planHistory.achievedGoals.spec.ts)

#### Accessibility Tests
Axe is an accessibility testing engine for websites. [axe-core](https://www.npmjs.com/package/@axe-core/playwright) has been added to playwright fixture, to run a scan, see example below.

```js
test('should be accessible', async ({ page, makeAxeBuilder}) => {
    const accessibilityScanResults = await makeAxeBuilder()
    .include('#main-content')
    .analyze()
    expect(accessibilityScanResults.violations).toEqual([])
})
```

*Full Example:* [accessible-autocomplete.spec.ts](integration_tests/specs/sentencePlan/components/accessible-autocomplete.spec.ts)

## Deployment

The application is deployed to Cloud Platform environments using GitHub Actions and Helm charts.

### Environments
- **Development** - Continuous deployment from `main` branch
- **Preprod** - Deployed on successful dev testing
- **Production** - Manual approval required

### Security Scanning
- Trivy container scanning
- Veracode static analysis
- npm dependency auditing
- Gitleaks secret detection

## Contributing

### Pre-commit Hooks
The project uses Husky for pre-commit hooks that run:
- Gitleaks secret detection
- Linting (via lint-staged)
- Type checking
- Unit tests

### Code Style
- ESLint with HMPPS configuration
- Prettier for code formatting
- TypeScript strict mode enabled

## Documentation

- [Form Engine Documentation](packages/form-engine/docs/form-engine.md)
- [ARNS Assessment Platform Overview](packages/form-engine/docs/arns-assessment-platform.md)
- [Custom Components Guide](packages/form-engine/docs/custom-components.md)
- [Validation System](packages/form-engine/docs/validation-system.md)
