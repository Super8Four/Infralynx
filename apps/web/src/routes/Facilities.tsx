import {
  facilityStatusSchema,
  siteSchema,
  type FacilityStatus,
} from '@infralynx/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { type FormEvent, useMemo, useState } from 'react';

import { getFacilitySites, getRegions, getSiteGroups } from '../lib/facilities';
import { api } from '../lib/http';

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

function emptyToNull(value: string) {
  return value.trim() || null;
}

export function Facilities() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [regionId, setRegionId] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(blankSite);

  const sitesQuery = useQuery({
    queryKey: ['facility-sites'],
    queryFn: getFacilitySites,
  });
  const regionsQuery = useQuery({ queryKey: ['regions'], queryFn: getRegions });
  const groupsQuery = useQuery({
    queryKey: ['site-groups'],
    queryFn: getSiteGroups,
  });

  const createMutation = useMutation({
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
      setForm(blankSite);
      setShowCreate(false);
      await queryClient.invalidateQueries({ queryKey: ['facility-sites'] });
      await queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
  });

  const filteredSites = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return (sitesQuery.data ?? []).filter((site) => {
      const matchesSearch =
        !query ||
        [
          site.name,
          site.slug,
          site.facility,
          site.regionName,
          site.groupName,
          site.description,
        ].some((value) => value?.toLocaleLowerCase().includes(query));
      return (
        matchesSearch &&
        (!status || site.status === status) &&
        (!regionId || site.regionId === regionId)
      );
    });
  }, [regionId, search, sitesQuery.data, status]);

  return (
    <section className="site-inventory">
      <div className="inventory-header">
        <div>
          <p className="eyebrow">Organization</p>
          <h1>Sites</h1>
        </div>
        <div className="inventory-actions">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setShowCreate((visible) => !visible)}
          >
            <i className="bi bi-plus-lg" /> Add site
          </button>
          <Link className="btn btn-outline-secondary" to="/import">
            <i className="bi bi-box-arrow-in-down" /> Import
          </Link>
        </div>
      </div>

      <div className="inventory-tabs" role="tablist" aria-label="Site views">
        <button className="active" type="button">
          Results <span>{filteredSites.length}</span>
        </button>
        <button
          className={showFilters ? 'active' : ''}
          type="button"
          onClick={() => setShowFilters((visible) => !visible)}
        >
          Filters
        </button>
      </div>

      <div className="inventory-toolbar">
        <label className="visually-hidden" htmlFor="site-search">
          Quick search
        </label>
        <div className="input-group inventory-search">
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
          <input
            id="site-search"
            className="form-control"
            value={search}
            placeholder="Quick search"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <button
          className="btn btn-outline-secondary ms-auto"
          type="button"
          onClick={() => setShowFilters((visible) => !visible)}
        >
          <i className="bi bi-funnel" /> Filter
        </button>
      </div>

      {showFilters && (
        <div className="inventory-filter-panel">
          <label>
            Status
            <select
              className="form-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="retired">Retired</option>
            </select>
          </label>
          <label>
            Region
            <select
              className="form-select"
              value={regionId}
              onChange={(event) => setRegionId(event.target.value)}
            >
              <option value="">All regions</option>
              {(regionsQuery.data ?? []).map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn btn-link"
            type="button"
            onClick={() => {
              setSearch('');
              setStatus('');
              setRegionId('');
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {showCreate && (
        <SiteCreateForm
          form={form}
          setForm={setForm}
          regions={regionsQuery.data ?? []}
          groups={groupsQuery.data ?? []}
          pending={createMutation.isPending}
          error={createMutation.error?.message}
          onCancel={() => setShowCreate(false)}
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate(form);
          }}
        />
      )}

      {sitesQuery.error && (
        <div className="alert alert-danger mt-3">
          {sitesQuery.error.message}
        </div>
      )}

      <div className="site-results-card">
        <div className="table-responsive">
          <table className="table site-table mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Facility</th>
                <th scope="col">Region</th>
                <th scope="col">Site group</th>
                <th scope="col">Time zone</th>
                <th scope="col" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => (
                <tr key={site.id}>
                  <td>
                    <Link className="site-link" to={`/sites/${site.id}`}>
                      {site.name}
                    </Link>
                    <div className="site-slug">{site.slug}</div>
                  </td>
                  <td>
                    <StatusBadge status={site.status} />
                  </td>
                  <td>{site.facility ?? '—'}</td>
                  <td>{site.regionName ?? '—'}</td>
                  <td>{site.groupName ?? '—'}</td>
                  <td>{site.timeZone ?? '—'}</td>
                  <td className="text-end">
                    <Link
                      className="btn btn-sm btn-outline-secondary"
                      to={`/sites/${site.id}`}
                    >
                      View <i className="bi bi-chevron-right" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!sitesQuery.isPending && filteredSites.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-table">
                    No sites match the current view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="site-results-footer">
          Showing {filteredSites.length} of {(sitesQuery.data ?? []).length}{' '}
          site{(sitesQuery.data ?? []).length === 1 ? '' : 's'}
        </div>
      </div>
    </section>
  );
}

function SiteCreateForm({
  form,
  setForm,
  regions,
  groups,
  pending,
  error,
  onCancel,
  onSubmit,
}: {
  form: typeof blankSite;
  setForm: (form: typeof blankSite) => void;
  regions: Array<{ id: string; name: string }>;
  groups: Array<{ id: string; name: string }>;
  pending: boolean;
  error: string | undefined;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="site-create-card" onSubmit={onSubmit}>
      <div className="card-header">
        <h2>Add site</h2>
        <button className="btn-close" type="button" onClick={onCancel} />
      </div>
      <div className="card-body row g-3">
        <Field
          label="Name"
          required
          value={form.name}
          onChange={(name) => setForm({ ...form, name })}
        />
        <Field
          label="Slug"
          value={form.slug}
          placeholder="Generated from name"
          onChange={(slug) => setForm({ ...form, slug })}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(status) =>
            setForm({ ...form, status: facilityStatusSchema.parse(status) })
          }
          options={['active', 'planned', 'retired']}
        />
        <Select
          label="Region"
          value={form.regionId}
          onChange={(regionId) => setForm({ ...form, regionId })}
          empty="No region"
          options={regions.map((region) => ({
            value: region.id,
            label: region.name,
          }))}
        />
        <Select
          label="Site group"
          value={form.groupId}
          onChange={(groupId) => setForm({ ...form, groupId })}
          empty="No site group"
          options={groups.map((group) => ({
            value: group.id,
            label: group.name,
          }))}
        />
        <Field
          label="Facility ID"
          value={form.facility}
          onChange={(facility) => setForm({ ...form, facility })}
        />
        <Field
          label="Time zone"
          value={form.timeZone}
          placeholder="America/Chicago"
          onChange={(timeZone) => setForm({ ...form, timeZone })}
        />
        <Field
          label="Owner"
          value={form.owner}
          onChange={(owner) => setForm({ ...form, owner })}
        />
        <Field
          label="Latitude"
          value={form.latitude}
          onChange={(latitude) => setForm({ ...form, latitude })}
        />
        <Field
          label="Longitude"
          value={form.longitude}
          onChange={(longitude) => setForm({ ...form, longitude })}
        />
        <TextArea
          label="Description"
          value={form.description}
          onChange={(description) => setForm({ ...form, description })}
        />
        <TextArea
          label="Physical address"
          value={form.physicalAddress}
          onChange={(physicalAddress) => setForm({ ...form, physicalAddress })}
        />
        <TextArea
          label="Shipping address"
          value={form.shippingAddress}
          onChange={(shippingAddress) => setForm({ ...form, shippingAddress })}
        />
      </div>
      <div className="card-footer d-flex align-items-center gap-2">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save site'}
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        {error && <span className="text-danger small">{error}</span>}
      </div>
    </form>
  );
}

function Field({
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
    <label className="col-12 col-md-6 form-label">
      {label}
      <input
        className="form-control mt-1"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="col-12 col-md-6 form-label">
      {label}
      <textarea
        className="form-control mt-1"
        rows={2}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  empty,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
  empty?: string;
}) {
  return (
    <label className="col-12 col-md-6 form-label">
      {label}
      <select
        className="form-select mt-1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {empty && <option value="">{empty}</option>}
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
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}
