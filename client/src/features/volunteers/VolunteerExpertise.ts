// What a volunteer can help with
export enum VolunteerExpertise {
  CoreProgram = 'CORE_PROGRAM',
  Frontend = 'FRONTEND',
  Backend = 'BACKEND',
  Data = 'DATA',
  Tester = 'TESTER',
  Cloud = 'CLOUD',
  ProjectManagement = 'PROJECT_MANAGEMENT',
  EnglishMentor = 'ENGLISH_MENTOR',
  HrMentor = 'HR_MENTOR',
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
