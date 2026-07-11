import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import type { ReactNode } from 'react';

import {
  getFacilitySites,
  getLocations,
  getPrefixes,
  getRegions,
} from '../lib/facilities';
import { StatusBadge } from './Facilities';

export function SiteDetail() {
  const { siteId } = useParams();
  const sitesQuery = useQuery({
    queryKey: ['facility-sites'],
    queryFn: getFacilitySites,
  });
  const regionsQuery = useQuery({ queryKey: ['regions'], queryFn: getRegions });
  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });
  const prefixesQuery = useQuery({
    queryKey: ['prefixes'],
    queryFn: getPrefixes,
  });

  if (sitesQuery.isPending) {
    return <div className="site-loading">Loading site…</div>;
  }

  const site = (sitesQuery.data ?? []).find(
    (candidate) => candidate.id === siteId,
  );
  if (!site) {
    return (
      <div className="alert alert-warning">
        This site no longer exists. <Link to="/sites">Return to sites</Link>.
      </div>
    );
  }

  const trail = regionTrail(site.regionId, regionsQuery.data ?? []);
  const locations = (locationsQuery.data ?? []).filter(
    (location) => location.siteId === site.id,
  );
  const prefixes = (prefixesQuery.data ?? []).filter(
    (prefix) => prefix.siteId === site.id,
  );
  const mapUrl =
    site.latitude && site.longitude
      ? `https://www.openstreetmap.org/?mlat=${encodeURIComponent(site.latitude)}&mlon=${encodeURIComponent(site.longitude)}#map=15/${encodeURIComponent(site.latitude)}/${encodeURIComponent(site.longitude)}`
      : null;

  return (
    <section className="site-detail">
      <nav className="site-breadcrumb" aria-label="Breadcrumb">
        <Link to="/sites">Sites</Link>
        {trail.map((region) => (
          <span key={region.id}>
            <i className="bi bi-chevron-right" /> {region.name}
          </span>
        ))}
      </nav>

      <div className="detail-titlebar">
        <div>
          <p className="eyebrow">Site</p>
          <h1>{site.name}</h1>
          <span className="text-secondary">{site.slug}</span>
        </div>
        <div className="detail-actions">
          <Link className="btn btn-outline-secondary" to="/sites">
            <i className="bi bi-arrow-left" /> All sites
          </Link>
          <a className="btn btn-primary" href="#locations">
            <i className="bi bi-geo-alt" /> Locations
          </a>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-column">
          <DetailCard title="Site">
            <Definition label="Region">
              {trail.length
                ? trail.map((region) => region.name).join(' / ')
                : '—'}
            </Definition>
            <Definition label="Site group">{site.groupName ?? '—'}</Definition>
            <Definition label="Name">{site.name}</Definition>
            <Definition label="Status">
              <StatusBadge status={site.status} />
            </Definition>
            <Definition label="Facility">{site.facility ?? '—'}</Definition>
            <Definition label="Time zone">{site.timeZone ?? '—'}</Definition>
            <Definition label="Physical address">
              <span>{site.physicalAddress ?? '—'}</span>
              {mapUrl && (
                <a
                  className="btn btn-sm btn-primary ms-auto"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-geo-alt-fill" /> Map
                </a>
              )}
            </Definition>
            <Definition label="Shipping address">
              {site.shippingAddress ?? '—'}
            </Definition>
            <Definition label="GPS coordinates">
              {site.latitude && site.longitude
                ? `${site.latitude}, ${site.longitude}`
                : '—'}
            </Definition>
            <Definition label="Owner">{site.owner ?? '—'}</Definition>
          </DetailCard>

          <DetailCard title="Description">
            <p className="mb-0">
              {site.description ?? 'No description provided.'}
            </p>
          </DetailCard>
          <DetailCard title="Comments">
            <p className="mb-0">{site.comments ?? 'No comments.'}</p>
          </DetailCard>
        </div>

        <div className="detail-column">
          <DetailCard title="Related objects">
            <RelatedRow
              label="Locations"
              count={locations.length}
              href="#locations"
            />
            <RelatedRow
              label="Prefixes"
              count={prefixes.length}
              href="#prefixes"
            />
            <RelatedRow label="Site group" count={site.groupName ? 1 : 0} />
          </DetailCard>
          <DetailCard title="Scope">
            <p className="mb-0 text-secondary">
              DCIM relationships such as racks and devices will appear here only
              after those inventory models are implemented.
            </p>
          </DetailCard>
        </div>
      </div>

      <DetailCard title="Locations" id="locations">
        <SimpleTable
          columns={['Name', 'Status', 'Parent', 'Facility', 'Description']}
          rows={locations.map((location) => [
            location.name,
            <StatusBadge
              key={`${location.id}-status`}
              status={location.status}
            />,
            location.parentName ?? '—',
            location.facility ?? '—',
            location.description ?? '—',
          ])}
          empty="No locations have been added to this site."
        />
      </DetailCard>

      <DetailCard title="Prefixes" id="prefixes">
        <SimpleTable
          columns={['Prefix', 'VRF', 'Status', 'Description']}
          rows={prefixes.map((prefix) => [
            prefix.cidr,
            prefix.vrfName,
            <StatusBadge key={`${prefix.id}-status`} status={prefix.status} />,
            prefix.description ?? '—',
          ])}
          empty="No IPAM prefixes are assigned to this site."
        />
      </DetailCard>
    </section>
  );
}

function regionTrail(
  regionId: string | null,
  regions: Array<{ id: string; name: string; parentId: string | null }>,
) {
  const result: Array<{ id: string; name: string }> = [];
  let currentId = regionId;
  while (currentId) {
    const current = regions.find((region) => region.id === currentId);
    if (!current) break;
    result.unshift(current);
    currentId = current.parentId;
  }
  return result;
}

function DetailCard({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="detail-card">
      <header>{title}</header>
      <div className="detail-card-body">{children}</div>
    </section>
  );
}

function Definition({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="definition-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function RelatedRow({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href?: string;
}) {
  const content = (
    <>
      <span>{label}</span>
      <span className="related-count">{count}</span>
    </>
  );
  return href ? (
    <a className="related-row" href={href}>
      {content}
    </a>
  ) : (
    <div className="related-row">{content}</div>
  );
}

function SimpleTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: Array<ReactNode[]>;
  empty: string;
}) {
  return (
    <div className="table-responsive">
      <table className="table site-table mb-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="empty-table">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
