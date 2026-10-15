import { VolunteerAssignmentType } from '../VolunteerAssignmentType';

// Something a volunteer took on for HackYourFuture, like teaching a module or mentoring a trainee.
export interface VolunteerAssignment {
  readonly id: string;
  type: VolunteerAssignmentType;
  // The estimated total, or null when nobody estimated it.
  estimatedHours: number | null;
  startDate: Date;
  endDate: Date | null;
  notes: string | null;
}
