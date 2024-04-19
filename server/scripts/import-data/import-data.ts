// This script is used to import trainee data from a CSV file into the database.
// Usage: npx ts-node import-data.ts <path-to-csv-file>

import fs from 'fs';
import { parse } from 'csv-parse/sync';

const replaceBoolean = (str: string) => {
  return str === 'Yes' ? true : false;
};

const extractData = (data: string) => {
  const rows = parse(data, {
    columns: true,
  });

  return rows.map((row: any) => {
    return {
      personalInfo: {
        firstName: row['First Name*'],
        lastName: row['Last Name*'],
        preferredName: row['Preferred Name'],
        gender: row['Gender*'],
        pronouns: row['Pronouns'],
        location: row['Location'],
        countryOfOrigin: row['Country of Origin'],
        background: row['Background'],
        englishLevel: row['English Level'],
        professionalDutch: replaceBoolean(row['Professional Dutch']),
        hasWorkPermit: replaceBoolean(row['Work Permit']),
        residencyStatus: row['Residency Status'],
        receivesSocialBenefits: replaceBoolean(row['Uitkering']),
        caseManagerUrging: replaceBoolean(row['Case Manager Urging']),
        educationLevel: row['Education Level'],
        educationBackground: row['Education Background'],
        comments: row['Comments - Personal'],
      },
      contactInfo: {
        email: row['Email*'],
        githubHandle: row['GitHub Handle'],
        slack: row['Slack Handle'],
        phone: row['Phone Number'],
        linkedin: row['LinkedIn Profile URL'],
      },
      educationInfo: {
        startCohort: row['Start Cohort*'],
        currentCohort: row['Current Cohort'],
        learningStatus: row['Learning Status*'],
        startDate: row['Start Date'],
        graduationDate: row['Graduation Date'],
        quitReason: row['Quit Reason'],
        comments: row['Comments - Education'],
      },
      employmentInfo: {
        jobPath: row['Job Path*'],
        cvURL: row['CV URL'],
        availability: row['Availability'],
        preferredRole: row['Preferred Role'],
        preferredLocation: row['Preferred Location'],
        extraTechnologies: row['Extra Technologies'],
        comments: row['Comments - Employment'],
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
