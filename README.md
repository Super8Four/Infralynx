# Infralynx

Infralynx is a portable IP address management (IPAM) and data center
infrastructure management (DCIM) application built with Node.js, TypeScript,
AdminLTE, and PostgreSQL.

The project is being designed to run consistently in Docker on macOS,
Windows, Linux, and Raspberry Pi systems using both `amd64` and `arm64`
architectures.

## Project documentation

- [Architecture and technology decisions](docs/architecture.md)
- [Development and Docker workflow](docs/development.md)
- [Git and GitHub workflow](docs/git-workflow.md)
- [Release and upgrade policy](docs/releases.md)
- [Contributing](CONTRIBUTING.md)

## Quick start with Docker

Copy `.env.example` to `.env`, replace the development credentials, then run:

```sh
docker compose up --build
```

Open `http://localhost:8080`. Interactive API documentation is available at
`http://localhost:8080/api/docs/`.

## Workspace commands

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

The project is at version `0.1.0`. The dashboard, health API, OpenAPI document,
initial Drizzle schema, storage abstraction, tests, and production containers
are scaffolded. IPAM CRUD and authentication are the next feature work.
