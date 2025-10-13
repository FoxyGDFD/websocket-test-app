import { z } from 'zod';

export const requiredString = z
  .string()
  .min(1, 'Поле обязательно к заполнению');
export const urlField = z.string().url('Не валидный url');
export const emailField = z.string().email('Некорректный email');
