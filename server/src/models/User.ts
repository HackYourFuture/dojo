import z from 'zod';

export interface User {
  readonly id: string;
  email: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly imageUrl?: string;
}

export interface DisplayUser {
  readonly name: string;
  readonly imageUrl?: string;
}

export const CreateUserSchema = z.object({
  email: z.email(),
  name: z.string(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
