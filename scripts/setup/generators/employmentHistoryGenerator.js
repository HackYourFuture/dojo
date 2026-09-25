import { faker } from '../random.js';

export const generateEmploymentHistory = (trainee) => {
  const type = getEmploymentType(trainee.jobPath);
  const roles = trainee.jobPath === 'non-tech-job' && type === 'job' ? NON_TECH_ROLES : TECH_ROLES;
  const role = faker.helpers.arrayElement(roles);
  const startDate = faker.date.soon({ days: 365, refDate: trainee.graduationDate });
  const endDate = faker.datatype.boolean(0.5) ? null : faker.date.soon({ days: 730, refDate: startDate });
  const feeCollected = faker.datatype.boolean(0.3);

  return {
    type,
    companyName: faker.company.name(),
    role: type === 'internship' ? `${role} Intern` : role,
    startDate: toLocalDate(startDate),
    endDate: endDate && toLocalDate(endDate),
    feeCollected,
    feeAmount: feeCollected ? faker.number.int({ min: 5, max: 30 }) * 100 : null,
    comments: '',
  };
};

const getEmploymentType = (jobPath) => {
  if (jobPath === 'internship') {
    return 'internship';
  }
  return faker.helpers.weightedArrayElement([
    { value: 'job', weight: 80 },
    { value: 'internship', weight: 20 },
  ]);
};

// The API expects a plain yyyy-MM-dd date
const toLocalDate = (date) => date.toISOString().slice(0, 10);

const TECH_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Data Analyst',
  'Data Engineer',
  'QA Engineer',
  'Test Automation Engineer',
  'IT Support Specialist',
];

const NON_TECH_ROLES = [
  'Customer Service Representative',
  'Sales Associate',
  'Warehouse Worker',
  'Delivery Driver',
  'Administrative Assistant',
  'Project Coordinator',
];
