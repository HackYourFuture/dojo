import z from 'zod';

export enum EmploymentType {
  Internship = 'internship',
  Job = 'job',
}

// export interface EmploymentHistory {
//   readonly id: string;
//   type: EmploymentType;
//   companyName: string;
//   role: string;
//   startDate: Date;
//   endDate?: Date;
//   feeCollected: boolean;
//   feeAmount?: number;
//   comments?: string;
// }

const EmploymentTypeSchema = z.enum(EmploymentType);

export const EmploymentHistorySchema = z.object({
  id: z.string(),
  type: EmploymentTypeSchema,
  companyName: z.string(),
  role: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  feeCollected: z.boolean(),
  feeAmount: z.number().min(0).optional(),
  comments: z.string().optional(),
});

// TODO - Just an example, remove and uncomment the interface above
export type EmploymentHistory = ZodToEntity<typeof EmploymentHistorySchema>;
