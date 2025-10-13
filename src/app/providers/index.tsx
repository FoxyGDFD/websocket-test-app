import { QueryProvider } from './react-query.provider';
import { Router } from './router.provider';

export const Provider = () => {
  return (
    <QueryProvider>
      <Router />
    </QueryProvider>
  );
};
