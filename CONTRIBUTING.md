# Contributing

## Conflict-reduction workflow

1. Sync main locally before you start any work:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a short-lived branch for each change:
   ```bash
   git checkout -b feature/short-description
   ```
3. Keep PRs small and focused (avoid touching the same files across multiple PRs).
4. Rebase frequently if the PR is long-running:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
5. Avoid parallel edits on the same files (ex: `app/page.tsx`).
6. Merge with `--no-ff` or squash (team preference) to keep history clean.

## Vercel deployments

- Ensure the Vercel build targets the latest commit on the intended branch.
- Verify the commit SHA in the Vercel build log matches GitHub.

