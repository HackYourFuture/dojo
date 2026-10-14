// What a volunteer can help with
export enum VolunteerExpertise {
  CoreProgram = 'core-program',
  Frontend = 'frontend',
  Backend = 'backend',
  Data = 'data',
  Tester = 'tester',
  Cloud = 'cloud',
  ProjectManagement = 'project-management',
  EnglishMentor = 'english-mentor',
  HrMentor = 'hr-mentor',
}

export const volunteerExpertiseLabels: Record<VolunteerExpertise, string> = {
  [VolunteerExpertise.CoreProgram]: 'Core Program',
  [VolunteerExpertise.Frontend]: 'Frontend',
  [VolunteerExpertise.Backend]: 'Backend',
  [VolunteerExpertise.Data]: 'Data',
  [VolunteerExpertise.Tester]: 'Tester',
  [VolunteerExpertise.Cloud]: 'Cloud',
  [VolunteerExpertise.ProjectManagement]: 'Project management',
  [VolunteerExpertise.EnglishMentor]: 'English mentor',
  [VolunteerExpertise.HrMentor]: 'HR mentor',
};
