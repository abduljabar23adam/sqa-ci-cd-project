# SQA CI/CD Project

A small Node.js project demonstrating a full CI/CD quality gate using GitHub Actions, Jest, Playwright, Codecov, and SonarCloud.

**Repository:** https://github.com/abduljabar23adam/sqa-ci-cd-project

## Project Structure

```
sqa-ci-cd-project/
├── .github/workflows/quality-gate.yml   # CI/CD pipeline
├── src/
│   ├── calculator.js                    # Basic arithmetic class
│   └── userService.js                   # Simple user service
├── tests/                               # Jest unit tests (16 tests)
├── e2e/                                 # Playwright E2E tests
├── public/                              # Static page used by E2E tests
├── sonar-project.properties             # SonarCloud configuration
├── package.json
└── playwright.config.js
```

## Pipeline Flow

Every push to `main` (and every pull request targeting `main`) triggers the workflow in `.github/workflows/quality-gate.yml`. Two jobs run:

```
push to main
    │
    ▼
┌───────────────────────────────┐
│ Job 1: Unit Test & Coverage   │
│  - npm ci                     │
│  - npm test -- --coverage     │
│  - Upload to Codecov          │
│  - SonarCloud Scan            │
└───────────────┬───────────────┘
                │ needs: unit-test
                ▼
┌───────────────────────────────┐
│ Job 2: E2E Test               │
│  - npm ci                     │
│  - npx playwright install     │
│  - npx playwright test        │
│  - Upload Playwright report   │
└───────────────────────────────┘
```

`e2e-test` declares `needs: unit-test`, so it only runs if the unit tests pass. If unit tests fail, E2E is skipped.

## Tools Used

| Tool | Purpose |
|------|---------|
| **Jest** | Unit tests + coverage (lcov + text report) |
| **Playwright** | End-to-end browser tests |
| **GitHub Actions** | CI/CD orchestration |
| **Codecov** | Coverage trend reporting |
| **SonarCloud** | Static analysis + Quality Gate |

## Running Tests Locally

Install dependencies:

```bash
npm install
```

Run unit tests:

```bash
npm test
```

Run unit tests with coverage:

```bash
npm run test:coverage
```

Run E2E tests (first time only, install browsers):

```bash
npx playwright install
npx playwright test
```

## Quality Gate

The pipeline enforces a quality gate composed of:

1. **100% of unit tests must pass** — any failing test fails the `unit-test` job, blocking the pipeline.
2. **Coverage ≥ 80%** on lines, branches and functions — enforced by Jest thresholds and reported to Codecov + SonarCloud.
3. **SonarCloud Quality Gate must pass** — 0 critical issues, coverage above the threshold, no new bugs on the change.

If any of these fail, the pipeline turns red and E2E is skipped.

## Failure Simulation (Part F)

To verify the gate actually blocks bad code, a deliberately failing test was added:

```javascript
test('deliberately failing test for CI simulation', () => {
  expect(2 + 2).toBe(5);
});
```

Observations from the failed run:

1. **Failed job:** `unit-test` (Unit Test & Coverage)
2. **Failed test:** `Calculator › deliberately failing test for CI simulation`
3. **Error:** `expect(received).toBe(expected) — Expected: 5, Received: 4`
4. **Next job:** E2E was **skipped**, because it declares `needs: unit-test`
5. **Fix:** remove the failing assertion, commit, and push again

The failing test was then removed and the pipeline returned to green.

## Repository Secrets

Two secrets are configured in GitHub → Settings → Secrets and variables → Actions:

- `CODECOV_TOKEN` — uploads coverage to Codecov
- `SONAR_TOKEN` — authenticates the SonarCloud scan

## Lessons Learned

- A CI pipeline is only as reliable as its **secrets** — a mis-pasted token makes the run red even when the code is fine.
- `needs:` gives you real dependency ordering — a failing unit test genuinely stops E2E.
- Encoding matters: `sonar-project.properties` must be plain **ASCII/UTF-8 without BOM**, or the scanner silently fails to read it.
- Coverage must be generated **before** the Sonar scan, and the path in `sonar-project.properties` (`coverage/lcov.info`) must match Jest's output.