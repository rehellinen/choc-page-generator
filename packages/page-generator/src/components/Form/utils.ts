import { FormSchema } from '../../types/Form';

export function getAllProps<T extends object>(config: FormSchema<T>[]): string[] {
  return config.map((item) => item.name as string);
}
