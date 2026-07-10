import { createBrowserRouter } from 'react-router';

import { AppLayout } from './ui/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: () => (
      <main className="container py-5">
        <h1>Something went wrong</h1>
        <p>The requested page could not be displayed.</p>
      </main>
    ),
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import('./routes/Dashboard');
          return { Component: module.Dashboard };
        },
      },
      {
        path: 'prefixes',
        lazy: async () => {
          const module = await import('./routes/Prefixes');
          return { Component: module.Prefixes };
        },
      },
    ],
  },
]);
