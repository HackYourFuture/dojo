// This script is used to import trainee data from a CSV file into the database.
// Usage: npx ts-node import-data.ts <path-to-csv-file>

import fs from 'fs';
import { parse } from 'csv-parse/sync';

const replaceBoolean = (str: string) =>  {
  if(!str.trim()) {
    return null;
  }
  return str.trim().toLowerCase() === 'yes' ? true : false
};
const handleString = (str: string) => str.trim() === '' ? null : str.trim();

const extractData = (data: string) => {
  const rows = parse(data, {
    columns: true,
  });

  return rows.map((row: any) => {
    return {
      personalInfo: {
        firstName: handleString(row['First Name*']),
        lastName: handleString(row['Last Name*']),
        preferredName: handleString(row['Preferred Name']),
        gender: handleString(row['Gender']),
        pronouns: handleString(row['Pronouns']),
        location: handleString(row['Location']),
        countryOfOrigin: handleString(row['Country of Origin']),
        background: handleString(row['Background']),
        englishLevel: handleString(row['English Level']),
        professionalDutch: replaceBoolean(row['Professional Dutch']),
        hasWorkPermit: replaceBoolean(row['Work Permit']),
        residencyStatus: handleString(row['Residency Status']),
        receivesSocialBenefits: replaceBoolean(row['Uitkering']),
        caseManagerUrging: replaceBoolean(row['Case Manager Urging']),
        educationLevel: handleString(row['Education Level']),
        educationBackground: handleString(row['Education Background']),
        comments: handleString(row['Comments - Personal']),
      },
      contactInfo: {
        email: handleString(row['Email*'].toLowerCase()),
        githubHandle: handleString(row['GitHub Handle']),
        slackId: handleString(row['Slack ID']),
        phone: handleString(row['Phone Number']),
        linkedin: handleString(row['LinkedIn Profile URL']),
      },
      educationInfo: {
        startCohort: row['Start Cohort*'],
        currentCohort: row['Current Cohort'],
        learningStatus: handleString(row['Learning Status*']),
        startDate: handleString(row['Start Date']),
        graduationDate: handleString(row['Graduation Date']),
        quitReason: handleString(row['Quit Reason']),
        quitDate: handleString(row['Quit Date']),
        comments: handleString(row['Comments - Education']),
      },
      employmentInfo: {
        jobPath: handleString(row['Job Path*']),
        cvURL: handleString(row['CV URL']),
        availability: handleString(row['Availability']),
        preferredRole: handleString(row['Preferred Role']),
        drivingLicense: replaceBoolean(row['Driving License']),
        preferredLocation: handleString(row['Preferred Location']),
        extraTechnologies: handleString(row['Extra Technologies']),
        comments: handleString(row['Comments - Employment']),
      }
    }
  });
};

const main = async () => {
  const filePath = process.argv[2];
  const fileData = fs.readFileSync(filePath, 'utf8');
  const trainees = extractData(fileData);
  for(const trainee of trainees) {
    try {
      const newId = await postTrainee(trainee);
      console.log(`✅ ${newId} ${trainee.personalInfo.firstName} ${trainee.personalInfo.lastName}`);
    } catch (error: any) {
      console.log(`❌ ${trainee.personalInfo.firstName} ${trainee.personalInfo.lastName}`);
      console.log(`    ${error}`)
    }
  }
  
  console.log("Done!");
};

const postTrainee = async (trainee: any): Promise<string> => {
  const URL = 'http://localhost:7777/api/trainees';
  const TOKEN = '<TOKEN>';

  let response: any, body: any;
  try {
    response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(trainee),
    });
    body = await response.json();
  } catch (error: any) {
    throw new Error(`${error.message}`);
  };

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${body.error ?? ''}`);
  }
  return body.id;
};


main().then().catch(console.error);
