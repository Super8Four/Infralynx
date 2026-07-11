import {
  facilitySiteListSchema,
  facilityStatusSchema,
  locationListSchema,
  locationSchema,
  regionListSchema,
  regionSchema,
  siteGroupListSchema,
  siteGroupSchema,
  siteSchema,
  type FacilityStatus,
} from '@infralynx/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';

async function api<T>(
  url: string,
  init: RequestInit | undefined,
  parse: (value: unknown) => T,
) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      payload?.error?.message ??
        `Request failed with status ${response.status}.`,
    );
  }
  return parse(await response.json());
}

const getRegions = () =>
  api('/api/v1/facilities/regions', undefined, (value) =>
    regionListSchema.parse(value),
  );
const getSiteGroups = () =>
  api('/api/v1/facilities/site-groups', undefined, (value) =>
    siteGroupListSchema.parse(value),
  );
const getSites = () =>
  api('/api/v1/facilities/sites', undefined, (value) =>
    facilitySiteListSchema.parse(value),
  );
const getLocations = () =>
  api('/api/v1/facilities/locations', undefined, (value) =>
    locationListSchema.parse(value),
  );

const blankHierarchy = {
  name: '',
  slug: '',
  parentId: '',
  description: '',
  owner: '',
  comments: '',
};
const blankSite = {
  name: '',
  slug: '',
  status: 'active' as FacilityStatus,
  regionId: '',
  groupId: '',
  facility: '',
  timeZone: '',
  description: '',
  physicalAddress: '',
  shippingAddress: '',
  latitude: '',
  longitude: '',
  owner: '',
  comments: '',
};
const blankLocation = {
  siteId: '',
  name: '',
  slug: '',
  status: 'active' as FacilityStatus,
  parentId: '',
  facility: '',
  description: '',
  owner: '',
  comments: '',
};

function emptyToNull(value: string) {
  return value.trim() || null;
}

function errorMessage(...errors: Array<Error | null | undefined>) {
  return errors.find(Boolean)?.message;
}

export function Facilities() {
  const queryClient = useQueryClient();
  const [regionForm, setRegionForm] = useState(blankHierarchy);
  const [siteGroupForm, setSiteGroupForm] = useState(blankHierarchy);
  const [siteForm, setSiteForm] = useState(blankSite);
  const [locationForm, setLocationForm] = useState(blankLocation);

  const regionsQuery = useQuery({ queryKey: ['regions'], queryFn: getRegions });
  const groupsQuery = useQuery({
    queryKey: ['site-groups'],
    queryFn: getSiteGroups,
  });
  const sitesQuery = useQuery({
    queryKey: ['facility-sites'],
    queryFn: getSites,
  });
  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const regionMutation = useMutation({
    mutationFn: (input: typeof blankHierarchy) =>
      api(
        '/api/v1/facilities/regions',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...input,
            parentId: emptyToNull(input.parentId),
          }),
        },
        (value) => regionSchema.parse(value),
      ),
    onSuccess: async () => {
      setRegionForm(blankHierarchy);
      await queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
  });
  const siteGroupMutation = useMutation({
    mutationFn: (input: typeof blankHierarchy) =>
      api(
        '/api/v1/facilities/site-groups',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...input,
            parentId: emptyToNull(input.parentId),
          }),
        },
        (value) => siteGroupSchema.parse(value),
      ),
    onSuccess: async () => {
      setSiteGroupForm(blankHierarchy);
      await queryClient.invalidateQueries({ queryKey: ['site-groups'] });
    },
  });
  const siteMutation = useMutation({
    mutationFn: (input: typeof blankSite) =>
      api(
        '/api/v1/facilities/sites',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...input,
            regionId: emptyToNull(input.regionId),
            groupId: emptyToNull(input.groupId),
          }),
        },
        (value) => siteSchema.parse(value),
      ),
    onSuccess: async () => {
      setSiteForm(blankSite);
      await queryClient.invalidateQueries({ queryKey: ['facility-sites'] });
      await queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
  });
  const locationMutation = useMutation({
    mutationFn: (input: typeof blankLocation) =>
      api(
        '/api/v1/facilities/locations',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...input,
            parentId: emptyToNull(input.parentId),
          }),
        },
        (value) => locationSchema.parse(value),
      ),
    onSuccess: async () => {
      setLocationForm(blankLocation);
      await queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const error = errorMessage(
    regionsQuery.error,
    groupsQuery.error,
    sitesQuery.error,
    locationsQuery.error,
    regionMutation.error,
    siteGroupMutation.error,
    siteMutation.error,
    locationMutation.error,
  );
  const selectedLocationParents = (locationsQuery.data ?? []).filter(
    (location) => location.siteId === locationForm.siteId,
  );

  const submit =
    (action: () => void) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      action();
    };

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-2">
          <div>
            <h1 className="h3 mb-1">Site management</h1>
            <p className="text-secondary mb-0">
              Organize your presence geographically and functionally before
              assigning IPAM resources.
            </p>
          </div>
          <div className="small text-secondary">
            Racks, devices, and other DCIM inventory are not part of this
            release.
          </div>
        </div>
      </div>

      {error && (
        <div className="col-12">
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      )}

      <div className="col-12 col-xl-6">
        <div className="card h-100">
          <div className="card-header">
            <h2 className="card-title">Regions</h2>
          </div>
          <form
            className="card-body border-bottom"
            onSubmit={submit(() => regionMutation.mutate(regionForm))}
          >
            <HierarchyFields
              form={regionForm}
              parents={regionsQuery.data ?? []}
              onChange={setRegionForm}
              parentLabel="Parent region"
            />
            <SaveButton pending={regionMutation.isPending} label="Add region" />
          </form>
          <HierarchyList
            items={regionsQuery.data ?? []}
            empty="No regions yet."
          />
        </div>
      </div>

      <div className="col-12 col-xl-6">
        <div className="card h-100">
          <div className="card-header">
            <h2 className="card-title">Site groups</h2>
          </div>
          <form
            className="card-body border-bottom"
            onSubmit={submit(() => siteGroupMutation.mutate(siteGroupForm))}
          >
            <HierarchyFields
              form={siteGroupForm}
              parents={groupsQuery.data ?? []}
              onChange={setSiteGroupForm}
              parentLabel="Parent group"
            />
            <SaveButton
              pending={siteGroupMutation.isPending}
              label="Add site group"
            />
          </form>
          <HierarchyList
            items={groupsQuery.data ?? []}
            empty="No site groups yet."
          />
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Sites</h2>
          </div>
          <form
            className="card-body border-bottom"
            onSubmit={submit(() => siteMutation.mutate(siteForm))}
          >
            <div className="row g-3">
              <TextField
                label="Site name"
                value={siteForm.name}
                required
                onChange={(name) => setSiteForm({ ...siteForm, name })}
              />
              <TextField
                label="Slug"
                value={siteForm.slug}
                placeholder="Generated from name if blank"
                onChange={(slug) => setSiteForm({ ...siteForm, slug })}
              />
              <SelectField
                label="Status"
                value={siteForm.status}
                onChange={(status) =>
                  setSiteForm({
                    ...siteForm,
                    status: facilityStatusSchema.parse(status),
                  })
                }
                options={['active', 'planned', 'retired']}
              />
              <SelectField
                label="Region"
                value={siteForm.regionId}
                onChange={(regionId) => setSiteForm({ ...siteForm, regionId })}
                options={(regionsQuery.data ?? []).map((region) => ({
                  value: region.id,
                  label: region.name,
                }))}
                emptyLabel="No region"
              />
              <SelectField
                label="Site group"
                value={siteForm.groupId}
                onChange={(groupId) => setSiteForm({ ...siteForm, groupId })}
                options={(groupsQuery.data ?? []).map((group) => ({
                  value: group.id,
                  label: group.name,
                }))}
                emptyLabel="No site group"
              />
              <TextField
                label="Facility ID"
                value={siteForm.facility}
                onChange={(facility) => setSiteForm({ ...siteForm, facility })}
              />
              <TextField
                label="Time zone"
                value={siteForm.timeZone}
                placeholder="America/Chicago"
                onChange={(timeZone) => setSiteForm({ ...siteForm, timeZone })}
              />
              <TextField
                label="Latitude"
                value={siteForm.latitude}
                placeholder="41.878113"
                onChange={(latitude) => setSiteForm({ ...siteForm, latitude })}
              />
              <TextField
                label="Longitude"
                value={siteForm.longitude}
                placeholder="-87.629799"
                onChange={(longitude) =>
                  setSiteForm({ ...siteForm, longitude })
                }
              />
              <TextField
                label="Owner"
                value={siteForm.owner}
                onChange={(owner) => setSiteForm({ ...siteForm, owner })}
              />
              <TextAreaField
                label="Description"
                value={siteForm.description}
                onChange={(description) =>
                  setSiteForm({ ...siteForm, description })
                }
              />
              <TextAreaField
                label="Physical address"
                value={siteForm.physicalAddress}
                onChange={(physicalAddress) =>
                  setSiteForm({ ...siteForm, physicalAddress })
                }
              />
              <TextAreaField
                label="Shipping address"
                value={siteForm.shippingAddress}
                onChange={(shippingAddress) =>
                  setSiteForm({ ...siteForm, shippingAddress })
                }
              />
            </div>
            <SaveButton pending={siteMutation.isPending} label="Add site" />
          </form>
          <SiteList sites={sitesQuery.data ?? []} />
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Locations</h2>
          </div>
          <form
            className="card-body border-bottom"
            onSubmit={submit(() => locationMutation.mutate(locationForm))}
          >
            <div className="row g-3">
              <SelectField
                label="Site"
                required
                value={locationForm.siteId}
                onChange={(siteId) =>
                  setLocationForm({ ...locationForm, siteId, parentId: '' })
                }
                options={(sitesQuery.data ?? []).map((site) => ({
                  value: site.id,
                  label: site.name,
                }))}
                emptyLabel="Select a site"
              />
              <TextField
                label="Location name"
                required
                value={locationForm.name}
                onChange={(name) => setLocationForm({ ...locationForm, name })}
              />
              <TextField
                label="Slug"
                value={locationForm.slug}
                placeholder="Generated from name if blank"
                onChange={(slug) => setLocationForm({ ...locationForm, slug })}
              />
              <SelectField
                label="Status"
                value={locationForm.status}
                onChange={(status) =>
                  setLocationForm({
                    ...locationForm,
                    status: facilityStatusSchema.parse(status),
                  })
                }
                options={['active', 'planned', 'retired']}
              />
              <SelectField
                label="Parent location"
                value={locationForm.parentId}
                onChange={(parentId) =>
                  setLocationForm({ ...locationForm, parentId })
                }
                options={selectedLocationParents.map((location) => ({
                  value: location.id,
                  label: location.name,
                }))}
                emptyLabel="No parent location"
              />
              <TextField
                label="Facility ID"
                value={locationForm.facility}
                onChange={(facility) =>
                  setLocationForm({ ...locationForm, facility })
                }
              />
              <TextField
                label="Owner"
                value={locationForm.owner}
                onChange={(owner) =>
                  setLocationForm({ ...locationForm, owner })
                }
              />
              <TextAreaField
                label="Description"
                value={locationForm.description}
                onChange={(description) =>
                  setLocationForm({ ...locationForm, description })
                }
              />
            </div>
            <SaveButton
              pending={locationMutation.isPending}
              label="Add location"
              disabled={!sitesQuery.data?.length}
            />
          </form>
          <LocationList locations={locationsQuery.data ?? []} />
        </div>
      </div>
    </div>
  );
}

function HierarchyFields({
  form,
  parents,
  onChange,
  parentLabel,
}: {
  form: typeof blankHierarchy;
  parents: Array<{ id: string; name: string }>;
  onChange: (form: typeof blankHierarchy) => void;
  parentLabel: string;
}) {
  return (
    <div className="row g-3">
      <TextField
        label="Name"
        value={form.name}
        required
        onChange={(name) => onChange({ ...form, name })}
      />
      <TextField
        label="Slug"
        value={form.slug}
        placeholder="Generated from name if blank"
        onChange={(slug) => onChange({ ...form, slug })}
      />
      <SelectField
        label={parentLabel}
        value={form.parentId}
        onChange={(parentId) => onChange({ ...form, parentId })}
        options={parents.map((parent) => ({
          value: parent.id,
          label: parent.name,
        }))}
        emptyLabel="No parent"
      />
      <TextField
        label="Owner"
        value={form.owner}
        onChange={(owner) => onChange({ ...form, owner })}
      />
      <TextAreaField
        label="Description"
        value={form.description}
        onChange={(description) => onChange({ ...form, description })}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label">{label}</label>
      <textarea
        className="form-control"
        rows={2}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
function SelectField({
  label,
  value,
  onChange,
  options,
  emptyLabel,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
  emptyLabel?: string;
  required?: boolean;
}) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      >
        {emptyLabel && <option value="">{emptyLabel}</option>}
        {options.map((option) => {
          const item =
            typeof option === 'string'
              ? { value: option, label: option }
              : option;
          return (
            <option value={item.value} key={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
function SaveButton({
  pending,
  label,
  disabled,
}: {
  pending: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      className="btn btn-primary mt-3"
      type="submit"
      disabled={pending || disabled}
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}
function HierarchyList({
  items,
  empty,
}: {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    description: string | null;
  }>;
  empty: string;
}) {
  return (
    <div className="card-body table-responsive p-0">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Parent</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <code>{item.slug}</code>
              </td>
              <td>
                {items.find((candidate) => candidate.id === item.parentId)
                  ?.name ?? '—'}
              </td>
              <td>{item.description ?? '—'}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-secondary py-4">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function SiteList({
  sites,
}: {
  sites: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    regionName: string | null;
    groupName: string | null;
    facility: string | null;
    timeZone: string | null;
  }>;
}) {
  return (
    <div className="card-body table-responsive p-0">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>Site</th>
            <th>Status</th>
            <th>Region</th>
            <th>Group</th>
            <th>Facility</th>
            <th>Time zone</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id}>
              <td>
                <div>{site.name}</div>
                <code className="small">{site.slug}</code>
              </td>
              <td>
                <span
                  className={`badge text-bg-${site.status === 'active' ? 'success' : site.status === 'planned' ? 'warning' : 'secondary'}`}
                >
                  {site.status}
                </span>
              </td>
              <td>{site.regionName ?? '—'}</td>
              <td>{site.groupName ?? '—'}</td>
              <td>{site.facility ?? '—'}</td>
              <td>{site.timeZone ?? '—'}</td>
            </tr>
          ))}
          {sites.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-secondary py-4">
                No sites yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function LocationList({
  locations,
}: {
  locations: Array<{
    id: string;
    siteName: string;
    name: string;
    slug: string;
    status: string;
    parentName: string | null;
    facility: string | null;
  }>;
}) {
  return (
    <div className="card-body table-responsive p-0">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>Location</th>
            <th>Site</th>
            <th>Status</th>
            <th>Parent</th>
            <th>Facility</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>
                <div>{location.name}</div>
                <code className="small">{location.slug}</code>
              </td>
              <td>{location.siteName}</td>
              <td>{location.status}</td>
              <td>{location.parentName ?? '—'}</td>
              <td>{location.facility ?? '—'}</td>
            </tr>
          ))}
          {locations.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-secondary py-4">
                No locations yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
