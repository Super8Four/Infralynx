# Functional Requirements Specification (FRS)

| Field            | Value           |
| ---------------- | --------------- |
| Document ID      | ILX-FRS-001     |
| Version          | 0.2             |
| Status           | Draft           |
| Product baseline | Infralynx 0.1.x |
| Updated          | 2026-08-23      |

## 1. Purpose

This document defines the required product behavior for Infralynx, a portable IP address management (IPAM) and data center infrastructure management (DCIM) application. It translates the product and architecture decisions into testable functional requirements.

**Shall** identifies mandatory behavior. **Should** identifies planned behavior that may be deferred from the first usable release. Functional requirement IDs use the `FR-<AREA>-<NUMBER>` convention and must be referenced by implementation work and acceptance tests.

## 2. Scope and release boundaries

Infralynx is deployed for one organization per installation and supports multiple sites. The first usable product prioritizes IPAM and the facilities context required by IPAM. DCIM inventory follows after the IPAM foundation is stable.

### Current working baseline

- PostgreSQL-backed RIR, aggregate, VRF, prefix-role, prefix, IP-range, and IP-address data.
- Automatic parent-prefix and aggregate assignment based on containment.
- Recursive regions, site groups, and site locations.
- Site inventory and detail views.
- Facility and IPAM create/list flows exposed through `/api/v1` and the React application.
- Audit-event creation for implemented mutations.

### Deferred from the first usable release

- Multi-tenancy.
- DNS, DHCP, and RIR synchronization.
- Network discovery.
- Per-VRF duplicate-space exceptions, route targets, and ASN assignment.
- Racks, equipment, devices, virtual machines, contacts, and tenants.
- Application-service mapping.

Deferred features require separate approved requirements before implementation.

## 3. Users and authorization

| ID          | Requirement                                                                                                                     | Priority |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-AUTH-001 | Infralynx shall authenticate locally managed users before allowing access to protected application or API functions.            | Must     |
| FR-AUTH-002 | Infralynx shall provide Viewer, Operator, and Administrator system roles backed by granular permissions.                        | Must     |
| FR-AUTH-003 | Viewers shall be able to read authorized inventory but shall not mutate it.                                                     | Must     |
| FR-AUTH-004 | Operators shall be able to perform approved day-to-day IPAM and facilities mutations.                                           | Must     |
| FR-AUTH-005 | Administrators shall be able to manage users, role assignments, permissions, and system reference data.                         | Must     |
| FR-AUTH-006 | Permission checks shall not depend on hardcoded role names so custom roles can be introduced later.                             | Must     |
| FR-AUTH-007 | Users shall be able to sign in and sign out, and administrators shall be able to deactivate an account and revoke its sessions. | Must     |

## 4. Facilities management

### 4.1 Regions and site groups

| ID         | Requirement                                                                                                    | Priority |
| ---------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| FR-FAC-001 | Authorized users shall be able to create, list, view, update, and retire regions.                              | Must     |
| FR-FAC-002 | Regions shall support an optional recursive parent region.                                                     | Must     |
| FR-FAC-003 | Authorized users shall be able to create, list, view, update, and retire site groups independently of regions. | Must     |
| FR-FAC-004 | Site groups shall support an optional recursive parent site group.                                             | Must     |
| FR-FAC-005 | Region and site-group hierarchies shall reject missing parents, self-parenting, and cycles.                    | Must     |
| FR-FAC-006 | Names and slugs shall follow the uniqueness and formatting rules defined by the data model.                    | Must     |
| FR-FAC-007 | A slug shall be generated from the name when the user omits it.                                                | Must     |

### 4.2 Sites and locations

| ID          | Requirement                                                                                                                                              | Priority |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-SITE-001 | Authorized users shall be able to create, list, view, update, and retire sites.                                                                          | Must     |
| FR-SITE-002 | A site may belong to one region, one site group, both, or neither.                                                                                       | Must     |
| FR-SITE-003 | A site shall support active, planned, and retired states.                                                                                                | Must     |
| FR-SITE-004 | A site shall support name, slug, facility identifier, time zone, physical and shipping addresses, decimal coordinates, description, owner, and comments. | Must     |
| FR-SITE-005 | Latitude and longitude shall be optional and validated against their geographic ranges.                                                                  | Must     |
| FR-SITE-006 | A site detail shall display only implemented relationships, including its region, site group, locations, and IPAM prefixes.                              | Must     |
| FR-SITE-007 | Authorized users shall be able to create, list, view, update, and retire locations within a site.                                                        | Must     |
| FR-SITE-008 | Locations shall support recursive nesting, and a child location shall have the same site as its parent.                                                  | Must     |
| FR-SITE-009 | Site and location list views shall support quick search and useful operational filtering.                                                                | Must     |

## 5. IPAM reference data

| ID         | Requirement                                                                                                        | Priority |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| FR-REF-001 | Administrators shall be able to manage Regional Internet Registries (RIRs).                                        | Must     |
| FR-REF-002 | Authorized users shall be able to manage RIR-owned IPv4 and IPv6 aggregates.                                       | Must     |
| FR-REF-003 | Each aggregate shall belong to an RIR and support status, description, and owner metadata.                         | Must     |
| FR-REF-004 | Authorized users shall be able to manage VRFs with a unique name and optional route distinguisher and description. | Must     |
| FR-REF-005 | Authorized users shall be able to manage prefix roles for functional classification.                               | Must     |
| FR-REF-006 | Authorized users shall be able to manage VLAN groups and VLANs, with VLAN identifiers unique within a VLAN group.  | Must     |
| FR-REF-007 | VLAN identifiers shall be constrained to the approved IEEE 802.1Q range and product reservation policy.            | Must     |
| FR-REF-008 | Administrators shall be able to manage reusable tags and their display colors.                                     | Should   |

## 6. Prefix hierarchy

| ID         | Requirement                                                                                                                 | Priority |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-PFX-001 | Authorized users shall be able to create, list, view, update, and delete IPv4 and IPv6 prefixes.                            | Must     |
| FR-PFX-002 | A prefix shall belong to exactly one VRF and may relate to a site, aggregate, and prefix role.                              | Must     |
| FR-PFX-003 | A prefix shall support active, reserved, deprecated, and available states plus description and owner metadata.              | Must     |
| FR-PFX-004 | Prefix input shall be validated and normalized as PostgreSQL CIDR data.                                                     | Must     |
| FR-PFX-005 | An exact prefix shall be unique within a VRF.                                                                               | Must     |
| FR-PFX-006 | On creation, Infralynx shall infer the most specific containing parent prefix in the same VRF.                              | Must     |
| FR-PFX-007 | On creation, Infralynx shall infer the most specific containing aggregate when one exists.                                  | Must     |
| FR-PFX-008 | Prefix hierarchy views shall show parent, children, VRF, site, aggregate, role, family, status, owner, and description.     | Must     |
| FR-PFX-009 | Prefix list views shall support search, filtering, sorting, and production-scale pagination.                                | Must     |
| FR-PFX-010 | Prefix deletion shall require confirmation and shall return an actionable conflict when dependent records prevent deletion. | Must     |
| FR-PFX-011 | Infralynx shall calculate prefix utilization without enumerating an IPv6 address space.                                     | Should   |

## 7. IP addresses and ranges

| ID        | Requirement                                                                                                                    | Priority |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| FR-IP-001 | Authorized users shall be able to create, list, view, update, and delete IPv4 and IPv6 addresses.                              | Must     |
| FR-IP-002 | An IP address shall belong to one VRF and support status, DNS name, description, and owner metadata.                           | Must     |
| FR-IP-003 | An exact IP address shall be unique within a VRF.                                                                              | Must     |
| FR-IP-004 | An IP address shall fall within an existing prefix in the same VRF.                                                            | Must     |
| FR-IP-005 | On creation, Infralynx shall automatically assign the most specific containing prefix.                                         | Must     |
| FR-IP-006 | Authorized users shall be able to create, list, view, update, and delete IP ranges.                                            | Must     |
| FR-IP-007 | Both range boundaries shall use the same address family, be correctly ordered, and fall within one prefix in the selected VRF. | Must     |
| FR-IP-008 | Infralynx shall automatically assign the containing prefix to a valid range.                                                   | Must     |
| FR-IP-009 | Address and range list views shall support search, filtering, sorting, and production-scale pagination.                        | Must     |
| FR-IP-010 | Users shall be able to identify available, active, reserved, and deprecated IP resources.                                      | Must     |
| FR-IP-011 | Infralynx should offer a concurrency-safe next-available-address workflow.                                                     | Should   |
| FR-IP-012 | Bulk import and export shall validate every record and report accepted and rejected rows.                                      | Should   |

## 8. Search, dashboards, and usability

| ID        | Requirement                                                                                                              | Priority |
| --------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| FR-UI-001 | Infralynx shall provide an authenticated operational dashboard for IPAM and facilities state.                            | Must     |
| FR-UI-002 | Inventory views shall use the established quick-search, filter, compact table, detail, and related-count pattern.        | Must     |
| FR-UI-003 | Loading, empty, stale, partial, permission-denied, and error states shall be distinguishable.                            | Must     |
| FR-UI-004 | The sidebar shall be collapsible and shall preserve usable navigation at supported viewport widths.                      | Must     |
| FR-UI-005 | Destructive operations shall identify the target and impact before confirmation.                                         | Must     |
| FR-UI-006 | Status and validation information shall not rely on color alone.                                                         | Must     |
| FR-UI-007 | Forms shall preserve valid user input after a validation failure and identify invalid fields.                            | Must     |
| FR-UI-008 | The interface shall not present deferred DCIM entities as active inventory before their data models and workflows exist. | Must     |

## 9. API and automation

| ID         | Requirement                                                                                                                            | Priority |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-API-001 | Infralynx shall expose supported product functions through a versioned REST API beginning at `/api/v1`.                                | Must     |
| FR-API-002 | The API shall publish machine-readable OpenAPI and interactive documentation.                                                          | Must     |
| FR-API-003 | API validation and authorization shall be authoritative even when the web client validates the same request.                           | Must     |
| FR-API-004 | Errors shall use a consistent code and safe message and shall distinguish validation, authorization, not-found, and conflict outcomes. | Must     |
| FR-API-005 | Collection endpoints shall support consistent server-side pagination, filtering, and sorting as their data volume grows.               | Must     |

## 10. Audit history

| ID         | Requirement                                                                                                                       | Priority |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-AUD-001 | Every create, update, delete, assignment, authentication, and permission change shall produce an audit event.                     | Must     |
| FR-AUD-002 | An audit event shall record actor, time, action, entity type and ID, request/correlation ID, and appropriate before/after values. | Must     |
| FR-AUD-003 | Application users shall not be able to edit or delete audit events.                                                               | Must     |
| FR-AUD-004 | Audit payloads shall exclude passwords, session material, and other authentication secrets.                                       | Must     |
| FR-AUD-005 | Authorized users shall be able to filter and inspect audit history.                                                               | Must     |

## 11. DCIM expansion

After the IPAM release is stable, separately approved requirements may add racks, rack groups and roles, equipment, devices, interfaces, power, cabling, configuration, and collected infrastructure state. These capabilities shall integrate with the existing sites, locations, IP resources, roles, permissions, and audit model rather than create parallel concepts.

## 12. Functional acceptance

A requirement is accepted when:

- Its behavior and priority are approved.
- Positive, negative, boundary, permission, and audit cases pass as applicable.
- The implementation and tests reference its ID.
- API and user documentation are updated.
- The Product Owner accepts the demonstrated outcome.

## 13. Open decisions

- [ ] Confirm the exact feature set required for the first stable `1.0.0` IPAM contract.
- [ ] Define permission keys and the Viewer, Operator, and Administrator permission matrix.
- [ ] Approve prefix-overlap policy beyond exact duplicate prevention.
- [ ] Define VLAN valid/reserved ranges.
- [ ] Define tag relationships for the first usable release.
- [ ] Approve next-available-address and bulk-import behavior.
- [ ] Prioritize the first DCIM expansion slice after IPAM.

## 14. Version history

| Version | Date       | Change                                                                             |
| ------- | ---------- | ---------------------------------------------------------------------------------- |
| 0.1     | 2026-08-21 | Initial requirements grounded in the current repository and architecture decisions |
| 0.2     | 2026-08-23 | Standardized the document as the FRS and requirement identifiers as `FR-*`         |
