import {
  facilitySiteListSchema,
  aggregateListSchema,
  ipAddressListSchema,
  ipRangeListSchema,
  locationListSchema,
  prefixListSchema,
  prefixRoleListSchema,
  regionListSchema,
  rirListSchema,
  siteGroupListSchema,
} from '@infralynx/shared';

import { api } from './http';

export const getRegions = () =>
  api('/api/v1/facilities/regions', undefined, (value) =>
    regionListSchema.parse(value),
  );

export const getSiteGroups = () =>
  api('/api/v1/facilities/site-groups', undefined, (value) =>
    siteGroupListSchema.parse(value),
  );

export const getFacilitySites = () =>
  api('/api/v1/facilities/sites', undefined, (value) =>
    facilitySiteListSchema.parse(value),
  );

export const getLocations = () =>
  api('/api/v1/facilities/locations', undefined, (value) =>
    locationListSchema.parse(value),
  );

export const getPrefixes = () =>
  api('/api/v1/ipam/prefixes', undefined, (value) =>
    prefixListSchema.parse(value),
  );

export const getPrefixRoles = () =>
  api('/api/v1/ipam/prefix-roles', undefined, (value) =>
    prefixRoleListSchema.parse(value),
  );

export const getRirs = () =>
  api('/api/v1/ipam/rirs', undefined, (value) => rirListSchema.parse(value));

export const getAggregates = () =>
  api('/api/v1/ipam/aggregates', undefined, (value) =>
    aggregateListSchema.parse(value),
  );

export const getIpAddresses = () =>
  api('/api/v1/ipam/ip-addresses', undefined, (value) =>
    ipAddressListSchema.parse(value),
  );

export const getIpRanges = () =>
  api('/api/v1/ipam/ip-ranges', undefined, (value) =>
    ipRangeListSchema.parse(value),
  );
