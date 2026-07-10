# Git and GitHub workflow

## Model

Infralynx uses trunk-based development with one permanent branch: `main`.
There is no long-lived `develop` branch. Short-lived branches are rebased onto
`origin/main`, reviewed in pull requests, and squash-merged. This produces a
linear, readable history while keeping `main` releasable.

## Branch names

Use lowercase, hyphenated names:

- `feature/prefix-allocation`
- `fix/session-expiration`
- `docs/backup-guide`
- `chore/dependency-updates`
- `release/1.0.0`

Keep a branch focused on one coherent change and delete it after merge.

## Start work

```sh
git switch main
git pull --ff-only
git switch -c feature/short-description
```

Commit locally as often as useful. Conventional Commit messages are preferred:

```text
feat(ipam): add prefix allocation
fix(api): reject an address outside its prefix
refactor(db): centralize audit event creation
test(ipam): cover overlapping prefixes
docs: explain the Git workflow
chore: update development dependencies
```

Use `!` or a `BREAKING CHANGE:` footer for an intentional breaking change.

## Rebase before review or merge

Never merge `main` into a feature branch merely to catch up. Rebase instead:

```sh
git fetch origin
git rebase origin/main
```

Resolve each conflict, stage the resolved files, then continue:

```sh
git add <resolved-files>
git rebase --continue
```

After rebasing a branch already published to GitHub, update it safely:

```sh
git push --force-with-lease
```

Never use plain `--force`. `--force-with-lease` refuses to overwrite remote
work that was not present in the local remote-tracking branch.

## Pull requests

1. Rebase onto the current `origin/main`.
2. Run formatting, linting, type checks, tests, and builds.
3. Push the branch and open a pull request.
4. Use a Conventional Commit pull request title.
5. Address review feedback with new commits or amended commits.
6. Rebase again if `main` moved and the branch no longer applies cleanly.
7. Squash-merge after required checks and reviews pass.
8. Delete the merged branch.

Direct pushes, force pushes, and deletion of `main` are prohibited. Merge
commits are not used for ordinary pull requests.

Running `npm install` configures the repository to use the committed Git hooks
in `.githooks`. The pre-push hook rejects direct pushes of `main` to `origin`.
This is a local safety net, not a substitute for GitHub branch protection.
When the repository plan supports protected private branches, `main` should
require the `quality` and `containers` checks, linear history, resolved review
conversations, and pull requests while disallowing force pushes and deletion.

## Recovering from mistakes

Git records remembered conflict resolutions through `rerere`. If a rebase is
going badly, return to the branch's pre-rebase state with:

```sh
git rebase --abort
```

Do not rewrite shared history on `main`. Revert an incorrect merged change with
a new pull request.
