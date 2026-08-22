# System requirements specification

| Field            | Value           |
| ---------------- | --------------- |
| Document ID      | ILX-SR-001      |
| Version          | 0.1             |
| Status           | Draft           |
| Product baseline | Infralynx 0.1.x |
| Updated          | 2026-08-21      |

## 1. Purpose

This document defines the technical, security, data, quality, portability, and operational requirements for Infralynx. It complements the [functional requirements](functional-requirements.md) and the confirmed decisions in [architecture.md](architecture.md).

## 2. Required technology baseline

| Area       | Requirement                                                               |
| ---------- | ------------------------------------------------------------------------- |
| Runtime    | Current patched Node.js 24 LTS with its bundled npm major                 |
| Language   | Strict TypeScript                                                         |
| Repository | npm-workspaces monorepo                                                   |
| Web        | React, Vite, React Router Data Mode, TanStack Query, React Hook Form, Zod |
| UI         | AdminLTE 4.x on Bootstrap 5.3; no AdminLTE 3 or jQuery dependency         |
| Tables     | TanStack Table with TanStack Virtual where justified                      |
| API        | Express, REST `/api/v1`, OpenAPI                                          |
| Database   | PostgreSQL 18, Drizzle ORM, `pg`, committed SQL migrations                |
| Tests      | Vitest and Playwright                                                     |
| Delivery   | Docker and Docker Compose on `linux/amd64` and `linux/arm64`              |
| License    | Apache License 2.0                                                        |

## 3. Architecture

| ID         | Requirement                                                                                                                              | Verification            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| SR-ARC-001 | The repository shall retain separate `apps/web`, `apps/api`, and `packages/shared` workspaces.                                           | Dependency inspection   |
| SR-ARC-002 | Shared transport schemas and types shall live in `@infralynx/shared`; database table types shall not become public contracts by default. | Architecture review     |
| SR-ARC-003 | Express routes shall use modular routers, shared validation, consistent errors, and centralized unexpected-error handling.               | Code and route tests    |
| SR-ARC-004 | React Router shall own navigation and route state; TanStack Query shall own server-state caching and mutation invalidation.              | Web architecture review |
| SR-ARC-005 | Browser validation may reuse shared Zod schemas, but API validation shall remain authoritative.                                          | Negative API tests      |
| SR-ARC-006 | External storage and later integrations shall be accessed through backend-neutral interfaces.                                            | Dependency review       |
| SR-ARC-007 | Long-running import, discovery, or collection work shall use durable asynchronous jobs rather than an interactive request lifetime.      | Failure and retry tests |

## 4. API contract

| ID         | Requirement                                                                                                                                | Verification                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| SR-API-001 | Public endpoints shall be versioned under `/api/v1`.                                                                                       | Route inspection            |
| SR-API-002 | OpenAPI shall be the published API contract and shall match implemented routes and schemas.                                                | Contract test               |
| SR-API-003 | Request and relevant response payloads shall be runtime validated with Zod.                                                                | Contract and negative tests |
| SR-API-004 | Errors shall use a common envelope containing a stable code and safe message.                                                              | Route tests                 |
| SR-API-005 | Collection endpoints shall use consistent server-side pagination, filtering, and sorting before unbounded results become production risks. | Load and contract tests     |
| SR-API-006 | Requests shall carry or receive a correlation ID that is available to logs and audit events.                                               | Integration test            |
| SR-API-007 | Breaking API changes shall use a new REST version or an approved compatibility and migration path.                                         | Release review              |

## 5. Data integrity and migrations

| ID         | Requirement                                                                                                                                                | Verification                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| SR-DAT-001 | PostgreSQL `cidr` and `inet` types shall store network and address data.                                                                                   | Schema inspection            |
| SR-DAT-002 | The database shall enforce exact prefix and IP-address uniqueness within the documented VRF scope.                                                         | Constraint tests             |
| SR-DAT-003 | Prefix and address containment shall be enforced in PostgreSQL where practical and verified in API transactions.                                           | Database integration tests   |
| SR-DAT-004 | Parent-prefix and aggregate assignment shall select the most specific containing record.                                                                   | Hierarchy tests              |
| SR-DAT-005 | IP ranges shall have same-family, ordered boundaries within one containing prefix and VRF.                                                                 | Boundary tests               |
| SR-DAT-006 | Recursive facilities hierarchies shall prevent cycles, and a location parent shall belong to the same site.                                                | Integration tests            |
| SR-DAT-007 | Critical uniqueness, foreign-key, and deletion behavior shall be represented by database constraints, not only UI validation.                              | Migration inspection         |
| SR-DAT-008 | Timestamps shall include time-zone information and use trusted application/database time.                                                                  | Schema and integration tests |
| SR-DAT-009 | Drizzle-generated SQL migrations shall be committed, reviewed, and executed explicitly before API startup.                                                 | CI and deployment inspection |
| SR-DAT-010 | Migrations shall be forward-only; downgrade shall restore the verified pre-upgrade backup and prior application image.                                     | Recovery exercise            |
| SR-DAT-011 | Schema changes shall be safe for the supported direct upgrade path from the latest patch of the previous minor release unless release notes say otherwise. | Upgrade test                 |

## 6. Authentication and authorization

| ID         | Requirement                                                                                                            | Verification                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| SR-SEC-001 | Local passwords shall be stored only as Argon2id hashes with configurable, benchmarked work factors.                   | Authentication tests and configuration review |
| SR-SEC-002 | Browser sessions shall be server-side PostgreSQL records; the browser shall receive only an opaque session identifier. | Session integration test                      |
| SR-SEC-003 | Production session cookies shall use `HttpOnly`, `Secure`, and an approved `SameSite` policy.                          | Cookie test                                   |
| SR-SEC-004 | Sessions shall rotate after authentication and privilege change and shall enforce idle and absolute expiry.            | Session lifecycle tests                       |
| SR-SEC-005 | State-changing browser requests shall use CSRF protection.                                                             | Security test                                 |
| SR-SEC-006 | API handlers shall enforce granular permissions server-side; UI visibility shall not be treated as access control.     | Permission-matrix tests                       |
| SR-SEC-007 | Authorization shall deny access when no permission grants it.                                                          | Negative tests                                |
| SR-SEC-008 | Deactivation, password change, and material permission change shall revoke or rotate affected sessions.                | Identity lifecycle tests                      |

## 7. Application and supply-chain security

| ID         | Requirement                                                                                                                         | Verification                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| SR-SEC-010 | Production traffic shall use HTTPS and approved security headers.                                                                   | Endpoint scan                    |
| SR-SEC-011 | Credentials and environment-specific values shall remain outside source control and container images.                               | Secret scan and image inspection |
| SR-SEC-012 | Untrusted input shall be bounded and validated for type, format, size, range, and authorization context.                            | Boundary and adversarial tests   |
| SR-SEC-013 | Logs, errors, audit events, and telemetry shall exclude passwords, session tokens, connection strings, and sensitive file contents. | Failure-path review              |
| SR-SEC-014 | `npm audit --omit=dev` and dependency review shall run in CI.                                                                       | CI evidence                      |
| SR-SEC-015 | Critical or high-severity findings shall block release unless a time-limited risk exception is approved.                            | Release gate inspection          |
| SR-SEC-016 | File uploads shall use generated object keys, sanitized filenames, size/type limits, authorization, checksums, and audit events.    | Upload security tests            |

## 8. Audit requirements

| ID         | Requirement                                                                                                                                     | Verification                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SR-AUD-001 | Every covered mutation, authentication event, and permission change shall create an audit event in the same reliable operation where practical. | Transaction tests                  |
| SR-AUD-002 | Audit events shall include actor, timestamp, action, entity, request ID, and appropriate before/after JSON.                                     | Schema and route tests             |
| SR-AUD-003 | Application users shall have no update or delete path for audit events.                                                                         | Authorization and route inspection |
| SR-AUD-004 | Audit retention and export shall follow an approved operational policy.                                                                         | Retention and export tests         |

## 9. Performance and capacity

| ID         | Initial requirement                                                                                                                                     | Verification               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| SR-PRF-001 | Versioned API read operations should complete within 500 ms at p95 under the approved reference load, excluding explicitly reported dependency latency. | Load test                  |
| SR-PRF-002 | Create/update operations should complete within 1 second at p95 under the approved reference load.                                                      | Load test                  |
| SR-PRF-003 | Inventory search should complete within 1 second at p95 at the approved scale.                                                                          | Load test                  |
| SR-PRF-004 | Database queries shall use appropriate indexes and bounded result sets.                                                                                 | Query-plan and load review |
| SR-PRF-005 | IPv6 capacity and utilization shall not enumerate individual addresses.                                                                                 | Unit and performance test  |
| SR-PRF-006 | Large tables and future topology views shall use server-side bounds and client virtualization where justified.                                          | Browser performance test   |

## 10. Reliability, backup, and storage

| ID         | Requirement                                                                                                                      | Verification             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| SR-REL-001 | The production availability, recovery-point, and recovery-time objectives shall be approved before `1.0.0`.                      | Release review           |
| SR-REL-002 | PostgreSQL and configured file storage shall be backed up before upgrades.                                                       | Upgrade evidence         |
| SR-REL-003 | Backup restoration shall be exercised at least annually and after material storage changes.                                      | Recovery record          |
| SR-REL-004 | Application instances shall not rely on container writable layers for persistent data.                                           | Container inspection     |
| SR-REL-005 | Local file storage shall use a persistent mounted volume; multiple replicas shall use S3-compatible or genuinely shared storage. | Deployment inspection    |
| SR-REL-006 | External calls shall use explicit timeouts and bounded retry where safe.                                                         | Failure testing          |
| SR-REL-007 | Retried mutations and jobs shall be idempotent or protected against duplicate effects.                                           | Duplicate-execution test |

## 11. Portability and deployment

| ID          | Requirement                                                                                                            | Verification                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SR-PORT-001 | Application images shall support `linux/amd64` and `linux/arm64`, including Raspberry Pi 5 and Apple Silicon targets.  | Multi-platform container build/run |
| SR-PORT-002 | The canonical full-stack workflow shall be Docker Compose on macOS, Windows, and Linux.                                | Platform smoke tests               |
| SR-PORT-003 | Code and configuration shall not depend on host-specific paths, binaries, package managers, or host-installed modules. | Clean-host test                    |
| SR-PORT-004 | Runtime configuration shall use environment variables documented in `.env.example`.                                    | Configuration audit                |
| SR-PORT-005 | Compose shall run migrations as a one-shot dependency before starting the ready API and web proxy.                     | Compose integration test           |
| SR-PORT-006 | Production deployments shall pin an immutable full version or image digest.                                            | Deployment review                  |

## 12. Observability

| ID         | Requirement                                                                                                                       | Verification     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| SR-OPS-001 | The API shall expose separate liveness and readiness behavior without exposing secrets.                                           | Endpoint tests   |
| SR-OPS-002 | Services shall emit structured logs with environment, version, severity, event, and correlation context.                          | Log-schema test  |
| SR-OPS-003 | Metrics shall cover request latency/errors, PostgreSQL health, migration state, job health, storage, and critical business flows. | Dashboard review |
| SR-OPS-004 | Alerts shall be actionable, routed to an owner, and linked to recovery guidance.                                                  | Alert exercise   |
| SR-OPS-005 | Deployments shall be visible in telemetry for change correlation.                                                                 | Deployment test  |

## 13. Accessibility and compatibility

| ID        | Requirement                                                                                                          | Verification                             |
| --------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| SR-UX-001 | Released workflows shall target WCAG 2.2 Level AA.                                                                   | Automated and manual accessibility tests |
| SR-UX-002 | All interactive functions shall be keyboard operable with visible focus.                                             | Manual test                              |
| SR-UX-003 | The interface shall remain usable at 200% zoom and supported responsive widths.                                      | Browser test                             |
| SR-UX-004 | Pull-request browser checks shall cover Chromium; the full release matrix shall cover Chromium, Firefox, and WebKit. | Playwright evidence                      |
| SR-UX-005 | The dark operational design shall retain sufficient text, focus, state, and control contrast.                        | Accessibility review                     |

## 14. Quality and delivery gates

| ID        | Requirement                                                                                                                                                | Verification                  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| SR-QA-001 | Every pull request shall pass formatting, ESLint, TypeScript type checking, Vitest, production build, production dependency audit, and Compose validation. | GitHub Actions evidence       |
| SR-QA-002 | API integration tests shall use real PostgreSQL where database semantics matter.                                                                           | Test configuration inspection |
| SR-QA-003 | Playwright shall cover critical facilities and IPAM workflows through a running system.                                                                    | E2E report                    |
| SR-QA-004 | Container images for API and web shall build successfully in CI.                                                                                           | Containers job evidence       |
| SR-QA-005 | Tests shall cover IPv4/IPv6 boundaries, containment, duplicates, hierarchy, concurrency, permissions, audit, and migration behavior.                       | Coverage mapping              |
| SR-QA-006 | All committed text shall use LF line endings and Prettier-controlled formatting where applicable.                                                          | Repository and CI check       |

## 15. Traceability

| Functional area         | FSR range             | Primary SR range                  |
| ----------------------- | --------------------- | --------------------------------- |
| Users and authorization | FSR-AUTH-*            | SR-SEC-001–008, SR-AUD-*          |
| Facilities              | FSR-FAC-_, FSR-SITE-_ | SR-DAT-006–008, SR-UX-_, SR-QA-_  |
| IPAM reference data     | FSR-REF-*             | SR-DAT-_, SR-API-_                |
| Prefixes                | FSR-PFX-*             | SR-DAT-001–005, SR-PRF-_, SR-QA-_ |
| Addresses and ranges    | FSR-IP-*              | SR-DAT-001–005, SR-PRF-_, SR-QA-_ |
| UI and dashboard        | FSR-UI-*              | SR-UX-_, SR-PRF-_                 |
| API and audit           | FSR-API-_, FSR-AUD-_  | SR-API-_, SR-AUD-_, SR-SEC-*      |

## 16. Open decisions

- [ ] Approve `1.0.0` scale, availability, RPO, and RTO targets.
- [ ] Define audit and uploaded-file retention.
- [ ] Select the durable job mechanism and production observability stack.
- [ ] Define container publication registry and multi-architecture release workflow.
- [ ] Approve security response times and supported browser versions.

## 17. Version history

| Version | Date       | Change                                                                               |
| ------- | ---------- | ------------------------------------------------------------------------------------ |
| 0.1     | 2026-08-21 | Initial system requirements grounded in current architecture and repository controls |
