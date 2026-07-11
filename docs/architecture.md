# Architecture and technology decisions

This document is the living record of Infralynx's technical decisions. Update
it whenever a decision is made or materially changed.

## Goals

- Provide IP address management (IPAM) and data center infrastructure
  management (DCIM) in one application.
- Provide one repeatable Docker-based development and deployment workflow.
- Support macOS, Windows, and Linux hosts.
- Support `linux/amd64` and `linux/arm64`, including Raspberry Pi 5 and Apple
  Silicon.
- Avoid host-specific paths, binaries, and configuration.
- Keep credentials and environment-specific values outside source control and
  container images.
- Make a fresh checkout straightforward to configure, build, test, and run.

## Confirmed technology

| Area                       | Decision                                                       | Notes                                                                                                   |
| -------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Runtime                    | Node.js 24 LTS                                                 | Use the current patched Node.js 24 release.                                                             |
| Language                   | TypeScript                                                     | Use strict type checking.                                                                               |
| UI framework               | React                                                          | Build an interactive client backed by a separate Node.js API.                                           |
| API framework              | Express                                                        | Use a modular API structure with explicit validation and error-handling conventions.                    |
| Admin theme                | AdminLTE 4.x                                                   | Bootstrap 5.3-based; avoid legacy AdminLTE 3 and jQuery dependencies.                                   |
| Database                   | PostgreSQL 18                                                  | Run the official multi-architecture image in development and testing.                                   |
| Database access            | Drizzle ORM with `pg`                                          | Keep schemas type-safe and PostgreSQL-oriented; commit generated SQL migrations.                        |
| Initial authentication     | Local accounts                                                 | Keep the first release self-contained; allow future SSO/OIDC providers without replacing authorization. |
| Sessions                   | PostgreSQL-backed server sessions                              | Send only an opaque session identifier in a protected HTTP cookie.                                      |
| Authorization              | Permission-backed RBAC                                         | Ship Viewer, Operator, and Administrator roles; allow custom roles later.                               |
| Package manager            | npm                                                            | Use the npm version bundled with the pinned Node.js runtime.                                            |
| Repository layout          | npm workspaces monorepo                                        | Keep the web client, API, and shared TypeScript packages together.                                      |
| API style                  | Versioned REST with OpenAPI                                    | Begin at `/api/v1`; publish a machine-readable contract and interactive documentation.                  |
| Runtime validation         | Zod                                                            | Share transport and form schemas without exposing database models as API contracts.                     |
| Unit and integration tests | Vitest                                                         | Use across web, API, and shared workspaces.                                                             |
| Browser tests              | Playwright                                                     | Cover critical workflows in Chromium, Firefox, and WebKit.                                              |
| Web build system           | Vite                                                           | Build the React client and share its transformation pipeline with Vitest.                               |
| Client routing             | React Router Data Mode                                         | Use nested routes, route-level loading, pending states, and error boundaries.                           |
| Server-state client        | TanStack Query                                                 | Centralize API fetching, caching, mutations, and invalidation.                                          |
| Form management            | React Hook Form with Zod                                       | Reuse shared schemas for typed browser and API validation.                                              |
| Data grids                 | TanStack Table and TanStack Virtual                            | Use AdminLTE-styled headless tables with virtualization where result sizes require it.                  |
| Password hashing           | Argon2id                                                       | Store only salted password hashes using configurable, benchmarked work factors.                         |
| Static analysis            | ESLint flat config                                             | Apply type-aware TypeScript and React correctness rules across the monorepo.                            |
| Formatting                 | Prettier                                                       | Enforce consistent formatting for source, configuration, and documentation.                             |
| First usable product       | IPAM                                                           | Deliver useful prefix and IP-address management before expanding the DCIM feature set.                  |
| Initial tenancy            | Single organization                                            | Support multiple sites now; add explicit multi-tenant isolation in a later release.                     |
| Initial IPAM model         | Sites, VRFs, prefixes, IP addresses, VLANs, statuses, and tags | Support hierarchical addressing and descriptive ownership metadata.                                     |
| Audit history              | Immutable application audit events                             | Record every data mutation plus authentication and permission changes.                                  |
| Release versioning         | Semantic Versioning                                            | Begin at `0.1.0`; tag releases and container images with immutable versions.                            |
| Source license             | Apache License 2.0                                             | Permit commercial use, modification, and redistribution with notice and patent terms.                   |
| Upgrade policy             | Explicit forward-only migrations                               | Back up PostgreSQL before upgrades; downgrade by restoring the backup and prior image.                  |
| File storage               | Pluggable local or S3-compatible backend                       | Default to persistent local storage; allow S3-compatible storage without changing application features. |
| Containers                 | Docker and Docker Compose                                      | Compose will be the canonical local workflow.                                                           |
| Source control             | Git and GitHub                                                 | Remote repository: `Super8Four/Infralynx`.                                                              |

## Product scope

Infralynx is an IPAM and DCIM application. Expected interaction patterns
include searchable and filterable inventory, IP and prefix management, rack
and device views, validation-heavy forms, bulk changes, dashboards, and
eventually live or recently collected infrastructure state.

The first usable release focuses on IPAM. It must provide useful prefix and IP
address management before the DCIM feature set expands. The initial deployment
model is one organization per installation with support for multiple sites.
Multi-tenant isolation is deferred and must be introduced through an explicit
schema and authorization migration rather than an unused placeholder tenant.

## Initial IPAM domain

The first IPAM schema includes:

- sites;
- VRFs;
- hierarchical IPv4 and IPv6 prefixes;
- IPv4 and IPv6 addresses;
- VLAN groups and VLANs;
- explicit lifecycle or operational statuses;
- reusable tags; and
- descriptions and ownership metadata.

Prefix containment, address containment, uniqueness within a VRF, and VLAN
number constraints must be enforced in the database where practical. DNS,
DHCP, RIR synchronization, discovery, and multi-tenant ownership are later
features and are not part of the first usable release.

## Facilities site management

The first facilities workflow establishes the organizational context used by
IPAM without beginning DCIM inventory. It includes two independent, recursive
hierarchies: **regions** for geographic organization and **site groups** for
functional organization. A site may belong to either, both, or neither.

Sites record an operational status, facility identifier, time zone, physical
and shipping addresses, decimal GPS coordinates, description, ownership, and
comments. Locations are optional, recursively nested subdivisions within one
site (for example, a floor and a room). A location's parent must belong to the
same site.

This release intentionally excludes tenants, tags, contacts, racks, rack
roles, rack groups, devices, and equipment relationships. Those are either a
future multi-tenancy/contact capability or DCIM scope. All facilities mutations
produce audit events, and site slugs are generated from names when omitted.

## Audit history

Every create, update, delete, assignment, authentication event, and permission
change produces an immutable audit event. Events record the actor, timestamp,
action, entity type and identifier, request or correlation identifier, and
appropriate before-and-after values. Application users cannot edit or delete
audit events. Sensitive authentication material must never be copied into
audit payloads.

## Release versioning and upgrades

Infralynx uses Semantic Versioning. Development begins at `0.1.0`, and `1.0.0`
marks the first stable IPAM release and its supported public contract. Patch
releases contain compatible fixes, minor releases contain backward-compatible
features, and major releases may contain documented breaking changes. Release
candidates use identifiers such as `1.0.0-rc.1`.

Git releases and immutable container images are tagged with the full version.
Convenience major and minor image tags may also be published, but production
deployments should pin the full version or image digest. REST API versioning is
separate and begins at `/api/v1`.

Database migrations are explicit, forward-only release steps and do not run as
a side effect of ordinary API startup. Operators must create a verified
PostgreSQL backup before upgrading. A schema downgrade is not supported;
rollback means restoring the pre-upgrade database backup and running the prior
application image. Each release documents migrations, configuration changes,
compatibility notes, and required operator actions.

## File and object storage

File storage is optional for the initial IPAM release and is accessed through a
backend-neutral application interface. Supported backends are:

- local persistent storage using a mounted Docker volume or an explicitly
  configured host path; and
- S3-compatible object storage configured with endpoint, region, bucket, and
  credentials.

Local storage is the default for a simple single-instance installation. Files
must never rely on the container's writable layer because it is disposable.
Deployments with multiple API replicas or external durability requirements
should use S3-compatible storage or a genuinely shared mounted filesystem.

PostgreSQL stores file metadata, ownership, access rules, checksums, and the
backend object key; file contents remain in the selected storage backend.
Uploads require generated object keys, filename sanitization, size and content
type limits, authorization checks, and audit events. Backup and restore must
cover both PostgreSQL and the configured file backend.

## UI architecture

Use a React client backed by a separate Node.js API. IPAM and DCIM workflows
benefit from interactive tables, filters, selection, bulk editing,
visualization, and partial page updates. A separate API also provides a stable
integration surface for automation and other clients.

Server-rendered HTML would reduce initial client-side complexity and can work
well for simple forms and page-oriented workflows, but increasingly interactive
inventory and visualization features would require additional browser-side
code. Search-engine optimization is not a deciding factor for this
authenticated application.

### Visual design system

Infralynx uses a dark operational interface designed for inventory-dense
workflows. The core palette is Gunmetal (`#263238`) for the application shell,
Salty Dog blue (`#234058`) for elevated surfaces and primary actions, and
Crimson (`#B3203B`) for destructive actions and retired status. Functional
success and warning colors remain distinct from the brand palette so resource
state is readable at a glance.

List and detail views follow the established inventory pattern: quick search,
filters, compact results tables, a dedicated object detail view, and related
object counts. The site view exposes only relationships that exist in the
product: regions, site groups, locations, and IPAM prefixes. Future DCIM
relationships must not be represented as active inventory until their models
and workflows exist.

## Authentication direction

The first release will authenticate locally managed users. Passwords must only
be stored using an appropriate password-hashing algorithm, and authentication
secrets must never be committed or included in container images.

Authentication and authorization will remain separate. Future SSO/OIDC
providers should map external identities onto the same internal users, roles,
and permissions. A migration to SSO must not require rewriting resource access
rules.

Browser authentication will use revocable server-side sessions stored in
PostgreSQL. The browser receives only an opaque session identifier. Production
cookies must use `HttpOnly`, `Secure`, and an appropriate `SameSite` policy.
Sessions must rotate after authentication or privilege changes and enforce
idle and absolute expiration. State-changing requests require CSRF protection.

Authorization will use granular permissions grouped into roles. Initial roles
are Viewer, Operator, and Administrator. API handlers must enforce permissions
server-side; UI visibility is only a usability feature and is not an access
control. Permission checks must not depend on hardcoded role names so custom
roles can be added later.

## Portability contract

The intended developer workflow is:

```sh
git pull
docker compose up --build
```

Application images must support `linux/amd64` and `linux/arm64`. Code must not
depend on Windows drive paths, macOS-only tools, Linux distribution package
managers, or host-installed Node.js modules. Runtime configuration must use
environment variables. Persistent data must use named Docker volumes or
documented bind mounts.

## Repository layout

The project will use npm workspaces with this initial structure:

```text
apps/
  web/       React and AdminLTE client
  api/       Express API and Drizzle database access
packages/
  shared/    Shared TypeScript schemas and types
```

The root workspace owns common development commands and the lockfile. Each
deployable application retains its own package manifest and container build.

## API contract and validation

The Express service will expose a versioned REST API beginning at `/api/v1`.
OpenAPI is the published interface contract and will drive interactive API
documentation. Breaking contract changes require a new API version or a
documented compatibility path.

Zod schemas will validate untrusted request data and relevant response data at
runtime. Transport schemas and inferred TypeScript types belong in the shared
workspace so the React client and Express API agree on payloads. Database table
types must not become public API contracts by default. Error responses,
pagination, filtering, sorting, and date formats will follow consistent shared
conventions.

## Testing strategy

Vitest is the common unit and integration test runner for all workspaces. API
integration tests must exercise Express routes and real PostgreSQL behavior
where database semantics matter. React component tests should focus on user
behavior rather than implementation details.

Playwright covers critical end-to-end workflows through the running system.
The core browser matrix is Chromium, Firefox, and WebKit. CI may use a smaller
fast-check matrix for pull requests and run the full matrix on the main branch
or scheduled builds.

## Web application foundation

Vite builds and serves the React client during development. Type checking is a
separate required command because Vite transpiles TypeScript without performing
full type analysis.

React Router Data Mode owns navigation, nested AdminLTE layouts, route
parameters, route-level loading, pending UI, and route error boundaries. It
must not duplicate the responsibilities of the selected server-state cache;
route loaders may prefetch data through that shared cache.

TanStack Query owns remote server state, including caching, mutations, retries,
and invalidation. React Router loaders may prefetch TanStack Query entries, but
must not introduce a separate cache.

React Hook Form manages interactive form state. Its Zod resolver reuses shared
transport schemas where the UI and API requirements match. Server-side Zod
validation remains authoritative because browser validation can be bypassed.

TanStack Table provides headless table and data-grid behavior rendered with
AdminLTE-compatible markup and styles. Sorting, filtering, and pagination must
support server-side operation. TanStack Virtual is added to views where the
rendered result size justifies virtualization.

## Password storage

Local passwords will be hashed with Argon2id. Work factors are configuration
with secure defaults and must be benchmarked on supported deployment hardware.
Only password hashes are stored. Authentication code must support increasing
the work factor and rehashing after a successful login.

## Code quality

ESLint uses flat configuration with type-aware TypeScript and React rules.
Prettier owns formatting for TypeScript, JSX, CSS, JSON, YAML, and Markdown.
Linting, formatting checks, and TypeScript type checking are independent CI
gates.

## Decisions still needed

We will make these decisions individually and record the outcome here.

1. Define development seed data and database migration procedures.
2. Define logging, error handling, health checks, metrics, and observability.
3. Define secrets and environment configuration management.
4. Define background jobs, scheduling, and network discovery boundaries.
5. Define production networking, TLS, backups, and recovery.
6. Add GitHub Actions for linting, type checking, tests, and multi-platform
   image builds.

## External references

- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
- [AdminLTE documentation](https://docs.adminlte.io/)
- [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/)
- [Official PostgreSQL Docker image](https://hub.docker.com/_/postgres)
