import { mapDomainToVolunteerAssignmentRequest, mapVolunteerAssignmentToDomain } from './mapper';

import { VolunteerAssignment } from '../VolunteerAssignment';
import { VolunteerAssignmentResponse } from './types';
import axios from 'axios';

// The latest start date first.
export const getVolunteerAssignments = async (volunteerId: string) => {
  const { data } = await axios.get<VolunteerAssignmentResponse[]>(`/api/volunteers/${volunteerId}/assignments`);
  return data.map((assignment) => mapVolunteerAssignmentToDomain(assignment));
};

export const addVolunteerAssignment = async (volunteerId: string, assignment: VolunteerAssignment) => {
  const assignmentRequest = mapDomainToVolunteerAssignmentRequest(assignment);
  const { data } = await axios.post<VolunteerAssignmentResponse>(
    `/api/volunteers/${volunteerId}/assignments`,
    assignmentRequest
  );
  return mapVolunteerAssignmentToDomain(data);
};

export const editVolunteerAssignment = async (volunteerId: string, assignment: VolunteerAssignment) => {
  const assignmentRequest = mapDomainToVolunteerAssignmentRequest(assignment);
  const { data } = await axios.put<VolunteerAssignmentResponse>(
    `/api/volunteers/${volunteerId}/assignments/${assignment.id}`,
    assignmentRequest
  );
  return mapVolunteerAssignmentToDomain(data);
};

export const deleteVolunteerAssignment = async (volunteerId: string, assignmentId: string) => {
  await axios.delete(`/api/volunteers/${volunteerId}/assignments/${assignmentId}`);
};
