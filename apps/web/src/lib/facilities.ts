import {
  facilitySiteListSchema,
  locationListSchema,
  prefixListSchema,
  regionListSchema,
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
