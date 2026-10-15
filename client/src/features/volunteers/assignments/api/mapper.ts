import { VolunteerAssignmentRequest, VolunteerAssignmentResponse } from './types';

import { VolunteerAssignment } from '../VolunteerAssignment';
import { blankFieldsToNull } from '../../../../data/text';
import { toISODateString } from '../../../../data/dates';

export const mapVolunteerAssignmentToDomain = (assignment: VolunteerAssignmentResponse): VolunteerAssignment => {
  return {
    id: assignment.id,
    type: assignment.type,
    estimatedHours: assignment.estimatedHours,
    startDate: new Date(assignment.startDate),
    endDate: assignment.endDate ? new Date(assignment.endDate) : null,
    notes: assignment.notes,
  };
};

export const mapDomainToVolunteerAssignmentRequest = (assignment: VolunteerAssignment): VolunteerAssignmentRequest => {
  return blankFieldsToNull<VolunteerAssignmentRequest>({
    type: assignment.type,
    estimatedHours: assignment.estimatedHours,
    startDate: toISODateString(assignment.startDate),
    endDate: assignment.endDate ? toISODateString(assignment.endDate) : null,
    notes: assignment.notes,
  });
};
