# template-npm-package
Template for npm package project

**Out of the box features:**
- semantic release
- eslint + prettier
- circular dependency check on pre-commit hook
- Slack release notification (requires Slack app to be created beforehand)

**Places to adjust:**
- `package.json`:
  - `name`
  - `description`
  - `repository.url`
- `.releaserc`:
  - `repositoryUrl` 

**Commands to run:**
```bash
npx semantic-release-cli setup
```

**GitHub Secrets:**
- `SLACK_WEBHOOK_URL`
