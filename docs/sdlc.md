# Software development life cycle

| Field       | Value        |
| ----------- | ------------ |
| Document ID | ILX-SDLC-001 |
| Version     | 0.1          |
| Status      | Draft        |
| Updated     | 2026-08-21   |

## 1. Purpose

This document defines how Infralynx changes move from discovery through operation. It applies to application code, shared schemas, SQL migrations, containers, configuration, tests, documentation, and releases.

Infralynx uses trunk-based development with one permanent branch, `main`. Short-lived branches are rebased, reviewed in pull requests, and squash-merged. `main` must remain releasable.

## 2. Lifecycle

```text
Discover -> Specify -> Design -> Build -> Verify -> Release -> Operate
              ^                                             |
              +------------- Improve / Retire <-------------+
```

| Phase    | Required outcome                                                     | Gate owner              |
| -------- | -------------------------------------------------------------------- | ----------------------- |
| Discover | Validated IPAM/DCIM problem and measurable outcome                   | Product owner           |
| Specify  | Approved FRS/SRS IDs and acceptance criteria                         | Product and engineering |
| Design   | Reviewed API, schema, security, UI, migration, and operations design | Engineering lead        |
| Build    | Focused, tested, documented implementation                           | Developer and reviewer  |
| Verify   | Retained functional and system-requirement evidence                  | Quality owner           |
| Release  | Versioned artifact with migration and recovery plan                  | Release approver        |
| Operate  | Observable, backed-up, supportable service                           | Operations owner        |

## 3. Definition of Ready

A work item is ready when:

- The user or operational outcome is clear.
- Applicable FRS and SRS identifiers are linked.
- Acceptance criteria cover success, failure, permission, and audit behavior.
- Data, API, UI, security, portability, migration, and operational impacts are understood.
- Dependencies and owners are identified.
- The work is small enough to review and release safely.
- Test and recovery expectations are defined.

## 4. Design controls

Design work shall address the applicable concerns:

- Shared Zod contract and versioned REST/OpenAPI behavior.
- PostgreSQL types, constraints, indexes, hierarchy, migrations, and concurrency.
- React Router, TanStack Query, form, table, and accessibility behavior.
- Authentication, granular permissions, CSRF, sessions, audit, and secret handling.
- Docker portability on `amd64` and `arm64` and across macOS, Windows, and Linux hosts.
- Background-job durability, idempotency, timeouts, and retries.
- Performance, telemetry, backup, restore, rollout, and rollback-by-restore.

Material decisions shall update `docs/architecture.md` or another focused design document before implementation is approved.

## 5. Branch and pull-request workflow

1. Update local knowledge of `origin/main`.
2. Create a short-lived branch using `feature/`, `fix/`, `docs/`, `chore/`, or `release/` and a lowercase hyphenated description.
3. Make focused Conventional Commits.
4. Rebase onto the current `origin/main`; do not merge `main` into the branch.
5. Run the local verification suite.
6. Push the branch and open a pull request using a Conventional Commit title.
7. Resolve review feedback and rebase again if required.
8. Squash-merge after required reviews and checks pass.
9. Delete the merged branch.

Direct and force pushes to `main` are prohibited. Published feature branches may use `--force-with-lease` after a rebase; plain `--force` is prohibited.

## 6. Implementation rules

- Strict TypeScript and shared runtime schemas are required at trust boundaries.
- Database models shall not become public API contracts by default.
- API handlers shall validate input and enforce permissions server-side.
- Every covered mutation shall create an immutable audit event.
- Database invariants shall use PostgreSQL constraints where practical.
- Migrations shall be generated, reviewed, committed, and applied explicitly.
- Credentials and environment values shall remain outside source and images.
- Persistent data shall not use a container writable layer.
- User-visible changes shall follow the established AdminLTE design and accessibility requirements.
- Documentation shall change with the code or operational behavior it describes.

## 7. Verification gates

Every pull request shall pass:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
docker compose config --quiet
```

CI additionally audits production dependencies and builds API and web containers. Applicable changes shall add PostgreSQL integration tests and Playwright coverage. The full browser matrix is required for releases or the approved scheduled gate.

Required test areas include:

- IPv4/IPv6 parsing, containment, hierarchy, uniqueness, ranges, and capacity.
- Facilities hierarchy and cross-site location rejection.
- Authentication, session lifecycle, permission denial, CSRF, and audit events.
- API contracts, errors, pagination, and concurrency.
- Drizzle migrations and supported upgrades.
- Responsive, keyboard, contrast, zoom, loading, empty, and error states.
- Container startup, readiness, persistence, backup, and restoration.

## 8. Database change process

1. Update `apps/api/src/db/schema.ts`.
2. Generate the Drizzle SQL migration.
3. Review the SQL for constraints, indexes, locks, data loss, duration, and compatibility.
4. Test migration from the supported prior release with representative data.
5. Document backup, configuration, and operator actions.
6. Run migrations as an explicit deployment step before the API becomes ready.

Migrations are forward-only. Production downgrade means restoring the pre-upgrade PostgreSQL and file-storage backup and running the previous application image.

## 9. Release process

Infralynx follows Semantic Versioning. Before `1.0.0`, a breaking change increments the minor version; `1.0.0` establishes the first stable IPAM contract.

A release branch shall:

- Update all workspace versions, `CHANGELOG.md`, migration notes, configuration documentation, and `.env.example` as needed.
- Pass the complete quality, browser, migration, security, and container suite.
- Confirm a verified PostgreSQL and file-storage backup procedure.
- Document compatibility, upgrade steps, and operator actions.
- Be reviewed and squash-merged before the annotated release tag is created.

Git releases and images shall use immutable full versions. Production deployments should pin the full version or digest.

## 10. Operations and incidents

Production shall monitor request health, PostgreSQL, jobs, storage, migrations, and critical IPAM/facilities workflows. Alerts shall have owners and recovery guidance.

Material incidents require a blameless review with impact, timeline, contributing conditions, recovery, and corrective actions. Actions shall have owners, due dates, and links to affected requirements, tests, or documentation.

Backup restoration shall be exercised at least annually and after material storage changes. Dependency health, capacity, vulnerabilities, access, and corrective actions shall be reviewed regularly.

## 11. Definition of Done

A change is done when:

- Applicable requirements and acceptance criteria pass.
- Code, schemas, migrations, tests, and documentation are reviewed.
- Required CI, security, PostgreSQL, browser, and container checks pass.
- Permission and audit behavior are verified where applicable.
- Migration, configuration, rollout, and recovery instructions are complete.
- The change is deployed to its intended environment and smoke checks pass.
- Telemetry confirms expected operation.
- Remaining defects or debt have owners and tracked work.

## 12. Exceptions and governance

An exception shall identify the failed control, affected scope, risk, compensating controls, accountable approver, expiration, and corrective work. Exceptions may not silently disable required checks.

Product and engineering shall review this SDLC, FRS, and SRS at least quarterly and after material incidents, architecture changes, or release-policy changes.

## 13. Version history

| Version | Date       | Change                                                                                              |
| ------- | ---------- | --------------------------------------------------------------------------------------------------- |
| 0.1     | 2026-08-21 | Initial SDLC aligned with the repository's Git, architecture, development, CI, and release policies |
