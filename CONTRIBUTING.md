# Contributing to Infralynx

Infralynx uses a protected, trunk-based Git workflow. `main` is always expected
to be releasable. Development happens on short-lived branches and reaches
`main` through pull requests.

Read [the Git workflow](docs/git-workflow.md) before creating a branch and
[the release policy](docs/releases.md) before changing a version or tag.

## Before opening a pull request

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Use a Conventional Commit-style pull request title such as:

```text
feat(ipam): add prefix allocation
fix(auth): rotate the session after login
docs: explain the backup procedure
```

The pull request title becomes the commit on `main` when the pull request is
squash-merged.

Unless explicitly stated otherwise, contributions intentionally submitted for
inclusion in Infralynx are provided under the Apache License 2.0, as described
in Section 5 of the license.
