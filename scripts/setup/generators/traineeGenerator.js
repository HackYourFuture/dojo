import { faker } from '../random.js';
import {
  getNameGender,
  getPronouns,
  getRandomGender,
  getRandomPhoneNumber,
  randomLearningStatus,
} from '../random.js';
import { nicknames } from '../dummy-data/nicknames.js';
import { educationBackground } from '../dummy-data/education-backgrounds.js';

// Load geo data
import countriesJSON from '../geo-data/dojo.countries.json' with { type: 'json' };
import citiesJSON from '../geo-data/dojo.cities.json' with { type: 'json' };
const countries = countriesJSON.map((c) => c.name);
const cities = citiesJSON.map((c) => c.name);

export const generateTrainee = () => {
  const trainee = {
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  trainee.gender = getRandomGender();;
  trainee.firstName = faker.person.firstName(getNameGender(trainee.gender));
  trainee.lastName = faker.person.lastName(getNameGender(trainee.gender));
  // Add preferred name
  if (faker.number.float() < 0.05) {
    trainee.preferredName = faker.helpers.arrayElement(nicknames);
  }
  trainee.pronouns = getPronouns(trainee.gender);
  trainee.dateOfBirth = faker.date.birthdate({ min: 18, max: 60, mode: 'age', refDate: '2026-09-01' });
  trainee.location = faker.helpers.arrayElement(cities);
  trainee.englishLevel = faker.helpers.arrayElement(ENGLISH_LEVELS);
  trainee.professionalDutch = faker.datatype.boolean(0.05);
  trainee.countryOfOrigin = faker.helpers.arrayElement(countries);
  trainee.background = faker.helpers.arrayElement(BACKGROUNDS);
  trainee.firstPermitIssueDate = faker.date.past({ years: 10, refDate: '2026-09-01' });
  trainee.nlArrivalDate = faker.date.past({ years: 2, refDate: trainee.firstPermitIssueDate });
  trainee.financialSupport = faker.helpers.arrayElement(FINANCIAL_SUPPORT);
  trainee.educationLevel = faker.helpers.arrayElement(EDUCATION_LEVELS);
  trainee.educationBackground = faker.helpers.arrayElement(educationBackground);
  trainee.weeklyWorkHours = faker.number.int({ min: 0, max: 24 });
  if (faker.number.float() < 0.1) {
    trainee.dietaryPreference = faker.helpers.arrayElement(DIETARY_PREFERENCES);
  }
  if (faker.number.float() < 0.005) {
    trainee.healthCondition = faker.helpers.arrayElement(HEALTH_CONDITIONS);
  }
  trainee.comments = '🤖 Auto generated dummy data for testing';
  trainee.esfId = "ESF-" + faker.string.numeric(8);

  // contact info
  trainee.email = faker.internet.exampleEmail({ firstName: trainee.firstName, lastName: trainee.lastName });
  trainee.slackId = 'USLACKBOT';
  trainee.phone = getRandomPhoneNumber();
  trainee.githubHandle = 'HackYourFuture';
  trainee.linkedinUrl = 'https://www.linkedin.com/school/hackyourfuture/';
  trainee.emergencyContactName = faker.person.fullName();
  trainee.emergencyContactRelationship = faker.helpers.arrayElement(EMERGENCY_CONTACT_RELATIONSHIPS);
  trainee.emergencyContactPhone = getRandomPhoneNumber();

  // Education Info
  trainee.currentCohort = faker.number.int({ min: 0, max: 60 });
  trainee.startCohort = trainee.currentCohort;
  trainee.startDate = faker.date.past({ years: 10, refDate: '2026-09-01' });
  trainee.learningStatus = randomLearningStatus();
  trainee.track = faker.helpers.arrayElement(TRACKS);
  // Different start cohort
  if (faker.number.float() < 0.02) {
    trainee.startCohort = Math.max(0, trainee.currentCohort - faker.number.int({ min: 1, max: 3 }));
  }
  // No cohort
  if (faker.number.float() < 0.003) {
    trainee.currentCohort = undefined;
  }
  // Quit reason and date
  if (trainee.learningStatus === 'quit') {
    trainee.quitReason = faker.helpers.arrayElement(QUIT_REASONS);
    trainee.quitDate = faker.date.soon({ days: 120, refDate: trainee.startDate });
  }
  // Graduation date and job path
  trainee.hasCar = faker.datatype.boolean(0.01);
  trainee.jobPath = 'not-graduated';
  if (trainee.learningStatus === 'graduated') {
    trainee.graduationDate = faker.date.future({ refDate: trainee.startDate });
    trainee.jobPath = faker.helpers.arrayElement(JOB_PATHS);
    trainee.jobSupportEndDate = faker.date.future({ refDate: trainee.graduationDate, years: 1 });
  }

  return trainee;
};


const ENGLISH_LEVELS = ['good', 'needs-work'];
const BACKGROUNDS = ['refugee', 'family-reunification', 'partner-of-skilled-migrant', 'vulnerable-group', 'eu-citizen'];
const FINANCIAL_SUPPORT = ['side-job', 'uitkering', 'family', 'savings', 'none'];
const EDUCATION_LEVELS = ['none', 'high-school', 'diploma', 'bachelors-degree', 'masters-degree', 'phd'];
const DIETARY_PREFERENCES = ['Vegetarian', 'Vegan', 'Halal', 'No dairy'];
const HEALTH_CONDITIONS = ['None', 'Allergies', 'Chronic illness', 'Disability'];
const EMERGENCY_CONTACT_RELATIONSHIPS = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Other'];
const TRACKS = ['frontend', 'backend', 'cloud', 'tester', 'data', 'core-program'];
const QUIT_REASONS = ['technical', 'social-skills', 'personal', 'withdrawn', 'municipality-or-monetary', 'left-nl', 'other'];
const JOB_PATHS = ['searching', 'internship', 'tech-job', 'non-tech-job', 'other-studies', 'support-ended'];