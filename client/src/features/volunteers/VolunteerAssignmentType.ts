// The types of assignment a volunteer can take on, in the server's order: their role preferences, and each assignment's type.
export enum VolunteerAssignmentType {
  AssignmentReview = 'ASSIGNMENT_REVIEW',
  TechInterview = 'TECH_INTERVIEW',
  Teaching = 'TEACHING',
  ProjectMentor = 'PROJECT_MENTOR',
  TechMentorship = 'TECH_MENTORSHIP',
  EnglishMentorship = 'ENGLISH_MENTORSHIP',
  HrMentorship = 'HR_MENTORSHIP',
  ContentCreation = 'CONTENT_CREATION',
  WorkshopHost = 'WORKSHOP_HOST',
}

export const volunteerAssignmentTypeLabels: Record<VolunteerAssignmentType, string> = {
  [VolunteerAssignmentType.AssignmentReview]: 'Assignment review',
  [VolunteerAssignmentType.TechInterview]: 'Tech interview',
  [VolunteerAssignmentType.Teaching]: 'Teaching',
  [VolunteerAssignmentType.ProjectMentor]: 'Project mentor',
  [VolunteerAssignmentType.TechMentorship]: 'Tech mentorship',
  [VolunteerAssignmentType.EnglishMentorship]: 'English mentorship',
  [VolunteerAssignmentType.HrMentorship]: 'HR mentorship',
  [VolunteerAssignmentType.ContentCreation]: 'Content creation',
  [VolunteerAssignmentType.WorkshopHost]: 'Workshop host',
};
