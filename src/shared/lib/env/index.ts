import { z } from 'zod';

import { urlField } from '@shared/lib/zod';

const zodEnv = z.object({
  VITE_SERVER_API_URL: urlField.min(1, 'Поле обязательно к заполнению'),
});

// eslint-disable-next-line no-restricted-properties
export const env = zodEnv.parse(import.meta.env);
