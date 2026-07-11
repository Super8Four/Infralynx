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
      {
        path: 'sites',
        lazy: async () => {
          const module = await import('./routes/Facilities');
          return { Component: module.Facilities };
        },
      },
      {
        path: 'sites/:siteId',
        lazy: async () => {
          const module = await import('./routes/SiteDetail');
          return { Component: module.SiteDetail };
        },
      },
      {
        path: 'ipam/:page',
        lazy: async () => {
          const module = await import('./routes/Placeholder');
          return { Component: module.Placeholder };
        },
      },
      {
        path: 'settings/:page',
        lazy: async () => {
          const module = await import('./routes/Placeholder');
          return { Component: module.Placeholder };
        },
      },
      {
        path: 'import',
        lazy: async () => {
          const module = await import('./routes/Placeholder');
          return { Component: module.Placeholder };
        },
      },
      {
        path: 'tags',
        lazy: async () => {
          const module = await import('./routes/Placeholder');
          return { Component: module.Placeholder };
        },
      },
    ],
  },
]);
