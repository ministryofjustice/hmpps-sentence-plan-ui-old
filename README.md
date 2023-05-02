# HMPPS Sentence Plan UI
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-sentence-plan-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-sentence-plan-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-sentence-plan-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-sentence-plan-ui)

User interface for the HMPPS Sentence Plan service.
The back-end API code can be found in https://github.com/ministryofjustice/hmpps-sentence-plan

* Dev: https://sentence-plan-dev.hmpps.service.justice.gov.uk

## Get started
### Pre-requisites

You'll need [Node 18.x](https://nodejs.org/download/release/latest-v18.x). 
If you're using [nvm](https://github.com/nvm-sh/nvm)/[fnm](https://github.com/Schniz/fnm) to manage your Node versions, run:
```shell
nvm install --latest-npm
```

Once you have the right Node version, install the package dependencies: 
```shell
npm install
```

### Run the service

To run the service locally, with dependencies in Docker:

```shell
# Start the dependencies only
docker-compose up --scale=app=0

# Start the UI service and watch for changes
npm run start:dev
```

Open http://localhost:3000 in your browser, and login as `AUTH_USER`.

### Integrate with dev services

Alternatively, you can integrate your local UI with the dev/test services deployed on MOJ Cloud Platform using a personal HMPPS Auth client.
If you don't already have a personal client, request one in the [#hmpps-auth-audit-registers](https://mojdt.slack.com/archives/C02S71KUBED) Slack channel.

You'll need the following roles:
* `ROLE_COMMUNITY` for searching probation cases
* `ROLE_SENTENCE_PLAN_RW` for accessing sentence plans and Delius case information

Create an `.env` file at the root of the project:
```properties
NODE_ENV=development
REDIS_HOST=localhost
HMPPS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
SENTENCE_PLAN_API_URL=https://sentence-plan-api-dev.hmpps.service.justice.gov.uk
PROBATION_SEARCH_API_URL=https://probation-offender-search-dev.hmpps.service.justice.gov.uk
DELIUS_INTEGRATION_API_URL=https://sentence-plan-and-delius-dev.hmpps.service.justice.gov.uk

# Add your personal client credentials below:
API_CLIENT_ID=clientid
API_CLIENT_SECRET=clientsecret
SYSTEM_CLIENT_ID=clientid
SYSTEM_CLIENT_SECRET=clientsecret
```

Then, start the UI service:
```shell
# Start Redis only
docker-compose up redis

# Start the UI service and watch for changes
npm run start:dev
```

## Testing
### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

To run the Cypress integration tests locally:

```shell
# Start dependencies
docker-compose -f docker-compose-test.yml up

# Start the UI in test mode
npm run start-feature:dev

# Run the tests in headless mode:
npm run int-test

# Or, run the tests with the Cypress UI:
npm run int-test-ui
```

### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

## Support

For any issues or questions, please contact the Probation Integration team via
the [#probation-integration-tech](https://mojdt.slack.com/archives/C02HQ4M2YQN) Slack channel. Or feel free to create
a [new issue](https://github.com/ministryofjustice/hmpps-sentence-plan-ui/issues/new) in this repository.