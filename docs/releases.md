# Release and upgrade policy

Infralynx follows [Semantic Versioning](https://semver.org/). Development begins
at `0.1.0`; `1.0.0` establishes the first stable public contract.

## Version meaning

- `PATCH` contains compatible fixes and security updates.
- `MINOR` contains backward-compatible features.
- `MAJOR` contains documented breaking changes after `1.0.0`.
- Before `1.0.0`, a breaking change increments `MINOR`.
- Prereleases use identifiers such as `1.0.0-rc.1`.

REST API versions such as `/api/v1` are independent from application SemVer. A
new application major does not automatically require a new REST path, and a new
REST major needs an explicit compatibility and migration plan.

## Prepare a release

Release work starts from a clean branch based on `origin/main`:

```sh
git switch main
git pull --ff-only
git switch -c release/1.2.3
npm version 1.2.3 --workspaces --include-workspace-root --no-git-tag-version
```

Update `CHANGELOG.md`, documentation, migration notes, and `.env.example` as
needed. Run the full verification suite and open a release pull request titled:

```text
chore(release): v1.2.3
```

## Publish a release

After the release pull request is squash-merged and `main` is green:

```sh
git switch main
git pull --ff-only
git tag -a v1.2.3 -m "Infralynx v1.2.3"
git push origin v1.2.3
```

Create a GitHub Release from the tag using the matching changelog section.
Container images use the immutable full version and commit SHA. Moving major or
minor convenience tags may be published later, but production deployments
should pin a full version or digest.

## Upgrade guarantees

- Database migrations are explicit and forward-only.
- A verified PostgreSQL and file-storage backup is required before upgrading.
- Normal API startup never changes the database schema.
- Each release documents configuration and operator actions.
- Downgrade means restoring the pre-upgrade backup and previous image.
- The supported direct upgrade path begins at the latest patch of the previous
  minor release unless release notes explicitly provide a wider path.

Never create a release tag from an unreviewed local commit or move an existing
release tag.
