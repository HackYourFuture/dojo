import { AuthenticatedUser } from './models';
import z from 'zod';

declare global {
  // Overwrite the default Express request and response types
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      user: AuthenticatedUser;
    }
  }

  /**
   * Flatten the type and make it more readable, One level only
   * @template T - The type to prettify/flatten
   * @example
   * interface X {a: string};
   * interface Y {b: number};
   * type Z = X & Y; // X & Y
   * type Prettified = Prettify<Z>; // { a: string; b: number; }
   */
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

  /**
   * Create a record with one readonly property
   * @template K - The key name for the property
   * @template T - The type of the property value
   * @example
   * type UserId = ReadOnly<'id', string>; // { readonly id: string }
   */
  type ReadOnly<K extends string, T> = Readonly<Record<K, T>>;
  // common instances
  type ReadonlyId = ReadOnly<'id', string>;

  /**
   * Create a type from a Zod schema with a readonly id property
   * @template Schema - A Zod schema type
   * @example
   * const userSchema = z.object({ name: z.string(), id: z.string() });
   * type User = ZodToEntity<typeof userSchema>;
   * // Result: { readonly id: string; name: string; }
   */
  type ZodToEntity<Schema extends z.ZodType> = Prettify<ReadonlyId & Omit<z.infer<Schema>, 'id'>>;
}
