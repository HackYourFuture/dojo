import { faker } from '@faker-js/faker';
import {
  Background,
  EducationLevel,
  EnglishLevel,
  JobPath,
  LearningStatus,
  QuitReason,
  ResidencyStatus,
  Trainee,
  TraineeContactInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  TraineePersonalInfo,
} from '../../../src/models/Trainee';
import {
  getNameGender,
  getPronouns,
  getRandomGender,
  getRandomPhoneNumber,
  randomLearningStatus,
} from '../random-helpers';
import { educationBackground, nicknames } from '../dummy-data';

// Load geo data
import countriesJSON from '../geo-data/dojo.countries.json';
import citiesJSON from '../geo-data/dojo.cities.json';
const countries = countriesJSON.map((c) => c.name);
const cities = citiesJSON.map((c) => c.name);

export const generateTrainee = (): Trainee => {
  const personalInfo = generatePersonalInfo();
  const contactInfo = generateContactInfo(personalInfo.firstName, personalInfo.lastName);
  const educationInfo = generateEducationInfo(0, 60);
  const employmentInfo = generateEmploymentInfo(educationInfo.learningStatus === LearningStatus.Graduated);

  const trainee: Trainee = {
    id: '',
    displayName: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    profileURL: '',
    personalInfo,
    contactInfo,
    educationInfo,
    employmentInfo,
    interactions: [],
  };

  return trainee;
};

const generatePersonalInfo = (): TraineePersonalInfo => {
  const gender = getRandomGender();

  // Make sure to generate a name that matches the gender
  const nameGender = getNameGender(gender);

  const personalInfo: TraineePersonalInfo = {
    firstName: faker.person.firstName(nameGender),
    lastName: faker.person.lastName(nameGender),
    gender: gender,
    pronouns: getPronouns(gender),
    location: faker.helpers.arrayElement(cities),
    englishLevel: faker.helpers.arrayElement(Object.values(EnglishLevel)),
    professionalDutch: faker.datatype.boolean(0.05),
    countryOfOrigin: faker.helpers.arrayElement(countries),
    background: faker.helpers.arrayElement(Object.values(Background)),
    hasWorkPermit: faker.datatype.boolean(0.85),
    residencyStatus: faker.helpers.arrayElement(Object.values(ResidencyStatus)),
    receivesSocialBenefits: faker.datatype.boolean(0.5),
    caseManagerUrging: faker.datatype.boolean(0.08),
    educationLevel: faker.helpers.arrayElement(Object.values(EducationLevel)),
    educationBackground: faker.helpers.arrayElement(educationBackground),
    comments: '🤖 Auto generated dummy data for testing',
  };

  // Add preferred name
  if (Math.random() < 0.05) {
    personalInfo.preferredName = faker.helpers.arrayElement(nicknames);
  }

  return personalInfo;
};

const generateContactInfo = (firstName: string, lastName: string): TraineeContactInfo => {
  return {
    email: faker.internet.exampleEmail({ firstName, lastName }),
    slackId: 'USLACKBOT',
    phone: getRandomPhoneNumber(),
    githubHandle: 'HackYourFuture',
    linkedin: 'https://www.linkedin.com/school/hackyourfuture/',
  };
};

const generateEducationInfo = (minCohort: number, maxCohort: number): TraineeEducationInfo => {
  const cohort = faker.number.int({ min: minCohort, max: maxCohort });

  const educationInfo: TraineeEducationInfo = {
    currentCohort: cohort,
    startCohort: cohort,
    startDate: faker.date.future({ refDate: '2016-01-01', years: 10 }),
    learningStatus: randomLearningStatus(),
    strikes: [],
    assignments: [],
    tests: [],
    comments: '🤖 Auto generated dummy data for testing',
  };

  // Different start cohort
  if (Math.random() < 0.02) {
    educationInfo.startCohort = Math.max(0, cohort - faker.number.int({ min: 1, max: 3 }));
  }

  // No cohort
  if (Math.random() < 0.003) {
    educationInfo.currentCohort = undefined;
  }

  // Quit reason and date
  if (educationInfo.learningStatus === LearningStatus.Quit) {
    educationInfo.quitReason = faker.helpers.arrayElement(Object.values(QuitReason));
    educationInfo.quitDate = faker.date.soon({ days: 120, refDate: educationInfo.startDate });
  }

  // Graduation date and job path
  if (educationInfo.learningStatus === LearningStatus.Graduated) {
    educationInfo.graduationDate = faker.date.future({ refDate: educationInfo.startDate });
  }

  return educationInfo;
};

const generateEmploymentInfo = (isGraduated: boolean): TraineeEmploymentInfo => {
  const employmentInfo: TraineeEmploymentInfo = {
    jobPath: JobPath.NotGraduated,
    cvURL: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Resume.pdf',
    availability: '',
    preferredRole: '',
    drivingLicense: faker.datatype.boolean(0.5),
    preferredLocation: '',
    extraTechnologies: '',
    employmentHistory: [],
    comments: '🤖 Auto generated dummy data for testing',
  };

  // If the trainee is graduated, set a job path
  if (isGraduated) {
    employmentInfo.jobPath = faker.helpers.arrayElement(
      Object.values(JobPath).filter((j) => j !== JobPath.NotGraduated)
    );
  }
  return employmentInfo;
};
