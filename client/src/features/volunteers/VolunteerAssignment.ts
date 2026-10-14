// The assignments a volunteer can take on, in the server's order. A volunteer's role preferences are a list of these.
export enum VolunteerAssignment {
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

export const volunteerAssignmentLabels: Record<VolunteerAssignment, string> = {
  [VolunteerAssignment.AssignmentReview]: 'Assignment review',
  [VolunteerAssignment.TechInterview]: 'Tech interview',
  [VolunteerAssignment.Teaching]: 'Teaching',
  [VolunteerAssignment.ProjectMentor]: 'Project mentor',
  [VolunteerAssignment.TechMentorship]: 'Tech mentorship',
  [VolunteerAssignment.EnglishMentorship]: 'English mentorship',
  [VolunteerAssignment.HrMentorship]: 'HR mentorship',
  [VolunteerAssignment.ContentCreation]: 'Content creation',
  [VolunteerAssignment.WorkshopHost]: 'Workshop host',
};
