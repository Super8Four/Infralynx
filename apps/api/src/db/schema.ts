import {
  type AnyPgColumn,
  boolean,
  cidr,
  inet,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const addressFamily = pgEnum('address_family', ['ipv4', 'ipv6']);
export const resourceStatus = pgEnum('resource_status', [
  'active',
  'reserved',
  'deprecated',
  'available',
]);
export const facilityStatus = pgEnum('facility_status', [
  'active',
  'planned',
  'retired',
]);
export const auditAction = pgEnum('audit_action', [
  'create',
  'update',
  'delete',
  'assign',
  'login',
  'logout',
  'permission_change',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 100 }).notNull(),
    displayName: varchar('display_name', { length: 200 }).notNull(),
    email: varchar('email', { length: 320 }),
    passwordHash: text('password_hash').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex('users_username_unique').on(table.username)],
);

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  isSystem: boolean('is_system').notNull().default(false),
  ...timestamps,
});

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 150 }).notNull().unique(),
  description: text('description'),
});

export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const regions = pgTable(
  'regions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    parentId: uuid('parent_id').references((): AnyPgColumn => regions.id, {
      onDelete: 'set null',
    }),
    description: text('description'),
    owner: varchar('owner', { length: 200 }),
    comments: text('comments'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('regions_parent_name_unique').on(table.parentId, table.name),
  ],
);

export const siteGroups = pgTable(
  'site_groups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    parentId: uuid('parent_id').references((): AnyPgColumn => siteGroups.id, {
      onDelete: 'set null',
    }),
    description: text('description'),
    owner: varchar('owner', { length: 200 }),
    comments: text('comments'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('site_groups_parent_name_unique').on(
      table.parentId,
      table.name,
    ),
  ],
);

export const sites = pgTable('sites', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  status: facilityStatus('status').notNull().default('active'),
  regionId: uuid('region_id').references(() => regions.id, {
    onDelete: 'set null',
  }),
  groupId: uuid('group_id').references(() => siteGroups.id, {
    onDelete: 'set null',
  }),
  facility: varchar('facility', { length: 100 }),
  timeZone: varchar('time_zone', { length: 100 }),
  description: text('description'),
  physicalAddress: text('physical_address'),
  shippingAddress: text('shipping_address'),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  owner: varchar('owner', { length: 200 }),
  comments: text('comments'),
  ...timestamps,
});

export const locations = pgTable(
  'locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    status: facilityStatus('status').notNull().default('active'),
    parentId: uuid('parent_id').references((): AnyPgColumn => locations.id, {
      onDelete: 'set null',
    }),
    facility: varchar('facility', { length: 100 }),
    description: text('description'),
    owner: varchar('owner', { length: 200 }),
    comments: text('comments'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('locations_site_slug_unique').on(table.siteId, table.slug),
    uniqueIndex('locations_site_parent_name_unique').on(
      table.siteId,
      table.parentId,
      table.name,
    ),
  ],
);

export const vrfs = pgTable(
  'vrfs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    routeDistinguisher: varchar('route_distinguisher', { length: 100 }),
    description: text('description'),
    ...timestamps,
  },
  (table) => [uniqueIndex('vrfs_name_unique').on(table.name)],
);

export const rirs = pgTable('rirs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  ...timestamps,
});

export const aggregates = pgTable(
  'aggregates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    rirId: uuid('rir_id')
      .notNull()
      .references(() => rirs.id, { onDelete: 'restrict' }),
    prefix: cidr('prefix').notNull().unique(),
    family: addressFamily('family').notNull(),
    status: resourceStatus('status').notNull().default('active'),
    description: text('description'),
    owner: varchar('owner', { length: 200 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('aggregates_rir_prefix_unique').on(table.rirId, table.prefix),
  ],
);

export const prefixRoles = pgTable('prefix_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  ...timestamps,
});

export const prefixes = pgTable(
  'prefixes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    vrfId: uuid('vrf_id')
      .notNull()
      .references(() => vrfs.id, { onDelete: 'restrict' }),
    siteId: uuid('site_id').references(() => sites.id, {
      onDelete: 'set null',
    }),
    aggregateId: uuid('aggregate_id').references(() => aggregates.id, {
      onDelete: 'set null',
    }),
    roleId: uuid('role_id').references(() => prefixRoles.id, {
      onDelete: 'set null',
    }),
    parentId: uuid('parent_id').references((): AnyPgColumn => prefixes.id, {
      onDelete: 'set null',
    }),
    prefix: cidr('prefix').notNull(),
    family: addressFamily('family').notNull(),
    status: resourceStatus('status').notNull().default('active'),
    description: text('description'),
    owner: varchar('owner', { length: 200 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('prefixes_vrf_prefix_unique').on(table.vrfId, table.prefix),
  ],
);

export const ipRanges = pgTable('ip_ranges', {
  id: uuid('id').primaryKey().defaultRandom(),
  vrfId: uuid('vrf_id')
    .notNull()
    .references(() => vrfs.id, { onDelete: 'restrict' }),
  prefixId: uuid('prefix_id')
    .notNull()
    .references(() => prefixes.id, { onDelete: 'restrict' }),
  startAddress: inet('start_address').notNull(),
  endAddress: inet('end_address').notNull(),
  prefixLength: integer('prefix_length').notNull(),
  family: addressFamily('family').notNull(),
  status: resourceStatus('status').notNull().default('active'),
  description: text('description'),
  owner: varchar('owner', { length: 200 }),
  ...timestamps,
});

export const ipAddresses = pgTable(
  'ip_addresses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    vrfId: uuid('vrf_id')
      .notNull()
      .references(() => vrfs.id, { onDelete: 'restrict' }),
    prefixId: uuid('prefix_id').references(() => prefixes.id, {
      onDelete: 'set null',
    }),
    address: inet('address').notNull(),
    family: addressFamily('family').notNull(),
    status: resourceStatus('status').notNull().default('active'),
    dnsName: varchar('dns_name', { length: 253 }),
    description: text('description'),
    owner: varchar('owner', { length: 200 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('ip_addresses_vrf_address_unique').on(
      table.vrfId,
      table.address,
    ),
  ],
);

export const vlanGroups = pgTable('vlan_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  ...timestamps,
});

export const vlans = pgTable(
  'vlans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    groupId: uuid('group_id')
      .notNull()
      .references(() => vlanGroups.id, { onDelete: 'cascade' }),
    vid: integer('vid').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    status: resourceStatus('status').notNull().default('active'),
    description: text('description'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('vlans_group_vid_unique').on(table.groupId, table.vid),
  ],
);

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  color: varchar('color', { length: 7 }),
  description: text('description'),
  ...timestamps,
});

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorUserId: uuid('actor_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  action: auditAction('action').notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  requestId: uuid('request_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  occurredAt: timestamp('occurred_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
