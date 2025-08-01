import { AuthenticatedUser } from './models';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      user: AuthenticatedUser;
    }
  }

  /**
   * Utility type to flatten the type and make it more readable.
   */
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}
