import {
  createPrefixSchema,
  prefixListSchema,
  prefixSummarySchema,
  siteListSchema,
  vrfListSchema,
  type CreatePrefix,
  type PrefixSummary,
} from '@infralynx/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { getPrefixRoles } from '../lib/facilities';

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
  if (response.status === 204) return parse(undefined);
  return parse(await response.json());
}

const getPrefixes = () =>
  api('/api/v1/ipam/prefixes', undefined, (value) =>
    prefixListSchema.parse(value),
  );
const getSites = () =>
  api('/api/v1/ipam/sites', undefined, (value) => siteListSchema.parse(value));
const getVrfs = () =>
  api('/api/v1/ipam/vrfs', undefined, (value) => vrfListSchema.parse(value));

const column = createColumnHelper<PrefixSummary>();

export function Prefixes() {
  const queryClient = useQueryClient();
  const prefixesQuery = useQuery({
    queryKey: ['prefixes'],
    queryFn: getPrefixes,
  });
  const sitesQuery = useQuery({ queryKey: ['sites'], queryFn: getSites });
  const vrfsQuery = useQuery({ queryKey: ['vrfs'], queryFn: getVrfs });
  const rolesQuery = useQuery({
    queryKey: ['prefix-roles'],
    queryFn: getPrefixRoles,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreatePrefix) =>
      api(
        '/api/v1/ipam/prefixes',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(input),
        },
        (value) => prefixSummarySchema.parse(value),
      ),
    onSuccess: async () => {
      form.reset({
        vrfId: vrfsQuery.data?.[0]?.id ?? '',
        siteId: sitesQuery.data?.[0]?.id ?? null,
        roleId: null,
        cidr: '',
        status: 'active',
        description: '',
        owner: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['prefixes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/api/v1/ipam/prefixes/${id}`, { method: 'DELETE' }, () => undefined),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ['prefixes'] }),
  });

  const form = useForm<CreatePrefix>({
    resolver: zodResolver(createPrefixSchema),
    values: {
      vrfId: vrfsQuery.data?.[0]?.id ?? '',
      siteId: sitesQuery.data?.[0]?.id ?? null,
      roleId: null,
      cidr: '',
      status: 'active',
      description: '',
      owner: '',
    },
    resetOptions: { keepDirtyValues: true },
  });

  const columns = useMemo(
    () => [
      column.accessor('cidr', { header: 'Prefix' }),
      column.accessor('vrfName', { header: 'VRF' }),
      column.accessor('siteName', {
        header: 'Site',
        cell: (cell) => cell.getValue() ?? '—',
      }),
      column.accessor('parentCidr', {
        header: 'Parent',
        cell: (cell) => cell.getValue() ?? '—',
      }),
      column.accessor('roleName', {
        header: 'Role',
        cell: (cell) => cell.getValue() ?? '—',
      }),
      column.accessor('status', { header: 'Status' }),
      column.accessor('description', {
        header: 'Description',
        cell: (cell) => cell.getValue() ?? '—',
      }),
      column.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(row.original.id)}
          >
            Delete
          </button>
        ),
      }),
    ],
    [deleteMutation],
  );

  const table = useReactTable({
    data: prefixesQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const error =
    createMutation.error ?? deleteMutation.error ?? prefixesQuery.error;

  return (
    <div className="row g-3">
      <div className="col-12 col-xl-8">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h3 className="card-title">Prefixes</h3>
            {prefixesQuery.isFetching && (
              <span className="small text-secondary">Refreshing…</span>
            )}
          </div>
          {error && (
            <div className="alert alert-danger m-3">{error.message}</div>
          )}
          <div className="card-body table-responsive p-0">
            <table className="table table-hover mb-0">
              <thead>
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {!prefixesQuery.isPending &&
                  table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center text-secondary py-4"
                      >
                        No prefixes yet. Add the first one using the form.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Add a prefix</h3>
          </div>
          <form
            className="card-body"
            onSubmit={(event) =>
              void form.handleSubmit((data) => createMutation.mutate(data))(
                event,
              )
            }
          >
            <label className="form-label" htmlFor="vrfId">
              VRF
            </label>
            <select
              id="vrfId"
              className="form-select"
              {...form.register('vrfId')}
            >
              {(vrfsQuery.data ?? []).map((vrf) => (
                <option value={vrf.id} key={vrf.id}>
                  {vrf.name}
                </option>
              ))}
            </select>

            <label className="form-label mt-3" htmlFor="siteId">
              Site
            </label>
            <select
              id="siteId"
              className="form-select"
              {...form.register('siteId', {
                setValueAs: (value: unknown) =>
                  typeof value === 'string' && value.length > 0 ? value : null,
              })}
            >
              <option value="">No site</option>
              {(sitesQuery.data ?? []).map((site) => (
                <option value={site.id} key={site.id}>
                  {site.name}
                </option>
              ))}
            </select>

            <label className="form-label mt-3" htmlFor="cidr">
              Prefix
            </label>
            <input
              id="cidr"
              className="form-control"
              placeholder="192.0.2.0/24"
              {...form.register('cidr')}
            />
            {form.formState.errors.cidr && (
              <div className="text-danger small mt-1">
                {form.formState.errors.cidr.message}
              </div>
            )}

            <label className="form-label mt-3" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              {...form.register('status')}
            >
              <option value="active">Active</option>
              <option value="reserved">Reserved</option>
              <option value="available">Available</option>
              <option value="deprecated">Deprecated</option>
            </select>

            <label className="form-label mt-3" htmlFor="roleId">
              Role
            </label>
            <select
              id="roleId"
              className="form-select"
              {...form.register('roleId', {
                setValueAs: (value: unknown) =>
                  typeof value === 'string' && value.length > 0 ? value : null,
              })}
            >
              <option value="">No role</option>
              {(rolesQuery.data ?? []).map((role) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <label className="form-label mt-3" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              rows={2}
              {...form.register('description')}
            />

            <label className="form-label mt-3" htmlFor="owner">
              Owner
            </label>
            <input
              id="owner"
              className="form-control"
              {...form.register('owner')}
            />

            <button
              className="btn btn-primary mt-3"
              type="submit"
              disabled={createMutation.isPending || !vrfsQuery.data?.length}
            >
              {createMutation.isPending ? 'Saving…' : 'Save prefix'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
