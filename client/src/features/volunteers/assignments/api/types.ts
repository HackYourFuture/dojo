import { VolunteerAssignmentType } from '../../VolunteerAssignmentType';

export interface VolunteerAssignmentResponse {
  id: string;
  type: VolunteerAssignmentType;
  estimatedHours: number | null;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  notes: string | null;
}

// Adding and editing both send every field.
export type VolunteerAssignmentRequest = Omit<VolunteerAssignmentResponse, 'id'>;
