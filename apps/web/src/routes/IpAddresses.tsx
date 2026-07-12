import {
  ipAddressSchema,
  ipRangeSchema,
  type ResourceStatus,
} from '@infralynx/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getIpAddresses, getIpRanges, getPrefixes } from '../lib/facilities';
import { api } from '../lib/http';

const blankAddress = {
  vrfId: '',
  address: '',
  status: 'active' as ResourceStatus,
  dnsName: '',
  description: '',
  owner: '',
};
const blankRange = {
  vrfId: '',
  startAddress: '',
  endAddress: '',
  prefixLength: 24,
  status: 'active' as ResourceStatus,
  description: '',
  owner: '',
};

export function IpAddresses() {
  const queryClient = useQueryClient();
  const [addressForm, setAddressForm] = useState(blankAddress);
  const [rangeForm, setRangeForm] = useState(blankRange);
  const prefixesQuery = useQuery({
    queryKey: ['prefixes'],
    queryFn: getPrefixes,
  });
  const addressesQuery = useQuery({
    queryKey: ['ip-addresses'],
    queryFn: getIpAddresses,
  });
  const rangesQuery = useQuery({
    queryKey: ['ip-ranges'],
    queryFn: getIpRanges,
  });
  const defaultVrfId = prefixesQuery.data?.[0]?.vrfId ?? '';

  const addressMutation = useMutation({
    mutationFn: (input: typeof blankAddress) =>
      api(
        '/api/v1/ipam/ip-addresses',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...input,
            vrfId: input.vrfId || defaultVrfId,
          }),
        },
        (value) => ipAddressSchema.parse(value),
      ),
    onSuccess: async () => {
      setAddressForm(blankAddress);
      await queryClient.invalidateQueries({ queryKey: ['ip-addresses'] });
    },
  });
  const rangeMutation = useMutation({
    mutationFn: (input: typeof blankRange) =>
      api(
        '/api/v1/ipam/ip-ranges',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...input,
            vrfId: input.vrfId || defaultVrfId,
          }),
        },
        (value) => ipRangeSchema.parse(value),
      ),
    onSuccess: async () => {
      setRangeForm(blankRange);
      await queryClient.invalidateQueries({ queryKey: ['ip-ranges'] });
    },
  });

  const error =
    addressMutation.error ??
    rangeMutation.error ??
    addressesQuery.error ??
    rangesQuery.error;

  return (
    <section className="site-inventory">
      <div className="inventory-header">
        <div>
          <p className="eyebrow">IPAM</p>
          <h1>IP addresses</h1>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error.message}</div>}
      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <div className="site-results-card">
            <div className="table-responsive">
              <table className="table site-table mb-0">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Prefix</th>
                    <th>VRF</th>
                    <th>Status</th>
                    <th>DNS name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {(addressesQuery.data ?? []).map((address) => (
                    <tr key={address.id}>
                      <td>{address.address}</td>
                      <td>{address.prefixCidr}</td>
                      <td>{address.vrfName}</td>
                      <td>
                        <span
                          className={`status-badge status-${address.status}`}
                        >
                          {address.status}
                        </span>
                      </td>
                      <td>{address.dnsName ?? '—'}</td>
                      <td>{address.description ?? '—'}</td>
                    </tr>
                  ))}
                  {!addressesQuery.isPending &&
                    !addressesQuery.data?.length && (
                      <tr>
                        <td colSpan={6} className="empty-table">
                          No IP addresses yet.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <form
            className="site-create-card"
            onSubmit={(event) => {
              event.preventDefault();
              addressMutation.mutate(addressForm);
            }}
          >
            <div className="card-header">
              <h2>Add IP address</h2>
            </div>
            <div className="card-body row g-3">
              <Input
                label="Address with mask"
                required
                value={addressForm.address}
                placeholder="192.0.2.10/24"
                onChange={(address) =>
                  setAddressForm({ ...addressForm, address })
                }
              />
              <SelectStatus
                value={addressForm.status}
                onChange={(status) =>
                  setAddressForm({ ...addressForm, status })
                }
              />
              <Input
                label="DNS name"
                value={addressForm.dnsName}
                onChange={(dnsName) =>
                  setAddressForm({ ...addressForm, dnsName })
                }
              />
              <Input
                label="Owner"
                value={addressForm.owner}
                onChange={(owner) => setAddressForm({ ...addressForm, owner })}
              />
              <Input
                label="Description"
                value={addressForm.description}
                onChange={(description) =>
                  setAddressForm({ ...addressForm, description })
                }
              />
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary"
                disabled={addressMutation.isPending || !defaultVrfId}
              >
                {addressMutation.isPending ? 'Saving…' : 'Save address'}
              </button>
              <span className="small text-secondary ms-2">
                The containing prefix is assigned automatically.
              </span>
            </div>
          </form>
        </div>
      </div>
      <div className="row g-3 mt-1">
        <div className="col-12 col-xl-7">
          <div className="site-results-card">
            <div className="table-responsive">
              <table className="table site-table mb-0">
                <thead>
                  <tr>
                    <th>Range</th>
                    <th>Prefix</th>
                    <th>VRF</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {(rangesQuery.data ?? []).map((range) => (
                    <tr key={range.id}>
                      <td>
                        {range.startAddress} – {range.endAddress}/
                        {range.prefixLength}
                      </td>
                      <td>{range.prefixCidr}</td>
                      <td>{range.vrfName}</td>
                      <td>
                        <span className={`status-badge status-${range.status}`}>
                          {range.status}
                        </span>
                      </td>
                      <td>{range.description ?? '—'}</td>
                    </tr>
                  ))}
                  {!rangesQuery.isPending && !rangesQuery.data?.length && (
                    <tr>
                      <td colSpan={5} className="empty-table">
                        No IP ranges yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <form
            className="site-create-card"
            onSubmit={(event) => {
              event.preventDefault();
              rangeMutation.mutate(rangeForm);
            }}
          >
            <div className="card-header">
              <h2>Add IP range</h2>
            </div>
            <div className="card-body row g-3">
              <Input
                label="Start address with mask"
                required
                value={rangeForm.startAddress}
                placeholder="192.0.2.10/24"
                onChange={(startAddress) =>
                  setRangeForm({ ...rangeForm, startAddress })
                }
              />
              <Input
                label="End address with mask"
                required
                value={rangeForm.endAddress}
                placeholder="192.0.2.99/24"
                onChange={(endAddress) =>
                  setRangeForm({ ...rangeForm, endAddress })
                }
              />
              <label className="col-12 col-md-6 form-label">
                Prefix length
                <input
                  className="form-control mt-1"
                  type="number"
                  min="0"
                  max="128"
                  value={rangeForm.prefixLength}
                  onChange={(event) =>
                    setRangeForm({
                      ...rangeForm,
                      prefixLength: Number(event.target.value),
                    })
                  }
                />
              </label>
              <SelectStatus
                value={rangeForm.status}
                onChange={(status) => setRangeForm({ ...rangeForm, status })}
              />
              <Input
                label="Description"
                value={rangeForm.description}
                onChange={(description) =>
                  setRangeForm({ ...rangeForm, description })
                }
              />
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary"
                disabled={rangeMutation.isPending || !defaultVrfId}
              >
                {rangeMutation.isPending ? 'Saving…' : 'Save range'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({
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
function SelectStatus({
  value,
  onChange,
}: {
  value: ResourceStatus;
  onChange: (value: ResourceStatus) => void;
}) {
  return (
    <label className="col-12 col-md-6 form-label">
      Status
      <select
        className="form-select mt-1"
        value={value}
        onChange={(event) => onChange(event.target.value as ResourceStatus)}
      >
        <option value="active">Active</option>
        <option value="reserved">Reserved</option>
        <option value="available">Available</option>
        <option value="deprecated">Deprecated</option>
      </select>
    </label>
  );
}
