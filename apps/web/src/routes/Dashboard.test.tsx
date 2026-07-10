import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the IPAM summary cards', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'ok',
          service: 'infralynx-api',
          version: '0.1.0',
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Dashboard />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Prefixes')).toBeInTheDocument();
    expect(await screen.findByText(/is healthy/)).toBeInTheDocument();
  });
});
