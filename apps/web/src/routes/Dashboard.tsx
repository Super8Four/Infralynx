import { healthResponseSchema } from '@infralynx/shared';
import { useQuery } from '@tanstack/react-query';

async function getHealth() {
  const response = await fetch('/api/v1/health');
  if (!response.ok) throw new Error('The API health check failed.');
  return healthResponseSchema.parse(await response.json());
}

const cards = [
  { label: 'Sites', value: 0, icon: 'bi-building', color: 'text-bg-primary' },
  {
    label: 'Prefixes',
    value: 0,
    icon: 'bi-diagram-3',
    color: 'text-bg-success',
  },
  {
    label: 'IP addresses',
    value: 0,
    icon: 'bi-hdd-network',
    color: 'text-bg-warning',
  },
  { label: 'VLANs', value: 0, icon: 'bi-bezier2', color: 'text-bg-info' },
];

export function Dashboard() {
  const health = useQuery({ queryKey: ['health'], queryFn: getHealth });

  return (
    <>
      <div className="row g-3">
        {cards.map((card) => (
          <div className="col-12 col-sm-6 col-xl-3" key={card.label}>
            <div className={`small-box ${card.color}`}>
              <div className="inner">
                <h3>{card.value}</h3>
                <p>{card.label}</p>
              </div>
              <i className={`small-box-icon bi ${card.icon}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-3">
        <div className="card-header">
          <h3 className="card-title">System status</h3>
        </div>
        <div className="card-body d-flex align-items-center gap-2">
          <span
            className={`status-dot ${health.isSuccess ? 'status-dot-ok' : 'status-dot-waiting'}`}
            aria-hidden="true"
          />
          {health.isPending && 'Checking the API…'}
          {health.isError && 'The API is unavailable.'}
          {health.data &&
            `${health.data.service} ${health.data.version} is healthy.`}
        </div>
      </div>
    </>
  );
}
