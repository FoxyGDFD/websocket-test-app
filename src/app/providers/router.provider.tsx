// Import the generated route tree
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from './route-tree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Router = () => <RouterProvider router={router} />;
