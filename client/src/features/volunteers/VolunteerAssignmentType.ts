// The types of assignment a volunteer can take on, in the server's order: their role preferences, and each assignment's type.
export enum VolunteerAssignmentType {
  AssignmentReview = 'assignment-review',
  TechInterview = 'tech-interview',
  Teaching = 'teaching',
  ProjectMentor = 'project-mentor',
  TechMentorship = 'tech-mentorship',
  EnglishMentorship = 'english-mentorship',
  HrMentorship = 'hr-mentorship',
  ContentCreation = 'content-creation',
  WorkshopHost = 'workshop-host',
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
