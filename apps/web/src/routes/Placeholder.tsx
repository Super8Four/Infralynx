import { useLocation } from 'react-router';

const pages: Record<string, { title: string; description: string }> = {
  addresses: {
    title: 'IP addresses',
    description: 'Address inventory and assignment will be added here.',
  },
  asns: {
    title: 'Autonomous system numbers',
    description: 'ASN inventory will be added here.',
  },
  aggregates: {
    title: 'Aggregates',
    description: 'Global aggregate network ranges will be added here.',
  },
  vrfs: {
    title: 'VRFs',
    description: 'VRF management will be added here.',
  },
  vlans: {
    title: 'VLANs',
    description: 'VLAN and VLAN group management will be added here.',
  },
  other: {
    title: 'Other IPAM resources',
    description: 'Additional IPAM resource types will be added here.',
  },
  import: {
    title: 'Import',
    description:
      'This will be the central place to import infrastructure data safely.',
  },
  tags: {
    title: 'Tags',
    description: 'Reusable tags will be managed here.',
  },
  users: {
    title: 'Users',
    description: 'Local user administration will be added here.',
  },
  groups: {
    title: 'Groups',
    description: 'Group administration will be added here.',
  },
  'api-tokens': {
    title: 'API tokens',
    description: 'API token management will be added here.',
  },
  permissions: {
    title: 'Permissions',
    description: 'Permission and role management will be added here.',
  },
  tenants: {
    title: 'Tenants',
    description: 'Tenant management is deferred until multi-tenancy begins.',
  },
  system: {
    title: 'System settings',
    description: 'System-wide configuration will be added here.',
  },
};

export function Placeholder() {
  const page = pages[useLocation().pathname.split('/').at(-1) ?? ''] ?? {
    title: 'Coming soon',
    description: 'This area has not been implemented yet.',
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title h4 mb-0">{page.title}</h1>
      </div>
      <div className="card-body">
        <p className="mb-0 text-secondary">{page.description}</p>
      </div>
    </div>
  );
}
