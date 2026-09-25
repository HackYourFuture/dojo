/**
 * Dojo Database Setup Script
 *
 * Usage: node index.js
 *
 * Prerequisites:
 * - MongoDB instance running
 * - .env file configured in the server root directory.
 * - Dojo server running locally (npm run dev)
 *
 * The script will generate 500 trainees by default (configurable via GENERATE_COUNT).
 */

import fs from 'fs';
import path from 'path';
import * as readline from 'node:readline/promises';
import { getNameGender, faker } from './random.js';
import { setupDB, testUser } from './setupDB.js';
import { generateInteraction } from './generators/interactionGenerator.js';
import * as dotenv from 'dotenv';
import { generateAssessment } from './generators/assessmentGenerator.js';
import { generateTrainee } from './generators/traineeGenerator.js';
import { generateEmploymentHistory } from './generators/employmentHistoryGenerator.js';
dotenv.config();

// Config
const GENERATE_COUNT = 500;
const EMPLOYED_JOB_PATHS = ['internship', 'tech-job', 'non-tech-job'];

const introStep = async () => {
  const message = `
  🛠️  Welcome to the Dojo Database Setup Script!
  🛠️  This script will help you set up your Dojo database with test data.

  Check the Current Configuration:
  - DB Host: ${process.env.DB_HOST}
  - DB Port: ${process.env.DB_PORT}
  - DB User: ${process.env.DB_USER}
  - Database: ${process.env.DB_NAME}
  - API URL: ${process.env.API_BASE_URL}
  
  Please make sure you have done the following before running this script:
  1. Your Database instance is running and reachable at ${process.env.DB_HOST}:${process.env.DB_PORT}.
  2. The Dojo API server is running and reachable at ${process.env.API_BASE_URL}.

  Press Enter to begin...
  `;
  console.log(message);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await rl.question('');
};

const checkEnvFileStep = () => {
  const envFilePath = path.resolve(import.meta.dirname, '.env');
  if (!fs.existsSync(envFilePath)) {
    console.error(`❌ .env file not found at ${envFilePath}`);
    console.error(
      '  Please create a .env file with the required environment variables. Use .env.example as a reference.'
    );
    process.exit(1);
  }
};

const setupDBStep = async () => {
  console.log('➡️ Preparing your dojo database..');
  try {
    await setupDB({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const testAPIConnectionStep = async (token) => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/session`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      console.error(`❌  User token invalid. Server returned HTTP ${response.status}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Could not connect to Dojo server at ${process.env.API_BASE_URL}. Please ensure the server is running and reachable.`);
    process.exit(1);
  }
};

const saveTrainee = async (trainee) => {
  const url = `${process.env.API_BASE_URL}/trainees`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testUser.apiToken}` },
    body: JSON.stringify(trainee),
  });

  const json = await response.json();
  if (!response.ok) {
    console.error(`Failed to save trainee: HTTP ${json.error}`);
  }
  return json;
};

const addAssessments = async (trainee, count) => {
  const url = `${process.env.API_BASE_URL}/trainees/${trainee.id}/assessments`;
  const promises = new Array(count).fill(0).map(() => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testUser.apiToken}` },
      body: JSON.stringify(generateAssessment(trainee)),
    });
  });
  await Promise.all(promises);
};

const addInteractions = async (trainee, count) => {
  const url = `${process.env.API_BASE_URL}/trainees/${trainee.id}/interactions`;
  const promises = new Array(count).fill(0).map(() => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testUser.apiToken}` },
      body: JSON.stringify(generateInteraction(trainee)),
    });
  });

  await Promise.all(promises);
};

const addEmploymentHistory = async (trainee, count) => {
  const url = `${process.env.API_BASE_URL}/trainees/${trainee.id}/employment-history`;
  const promises = new Array(count).fill(0).map(() => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testUser.apiToken}` },
      body: JSON.stringify(generateEmploymentHistory(trainee)),
    });
  });

  await Promise.all(promises);
};

const setProfilePicture = async (traineeId, imageBlob) => {
  const url = `${process.env.API_BASE_URL}/trainees/${traineeId}/picture`;
  const formData = new FormData();
  formData.append('picture', imageBlob);
  const response = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${testUser.apiToken}` },
    body: formData,
  });
  return response.ok;
};

const main = async () => {
  checkEnvFileStep();
  await introStep();
  // await setupDBStep();
  console.log('✅ Database setup completed successfully.\n');

  console.log('➡️ Testing connection to the server...');
  await testAPIConnectionStep(testUser.apiToken);
  console.log('✅ Connection to the Dojo API server successful. The server is running.\n');

  console.log(`➡️ Starting trainee generation. Will generate ${GENERATE_COUNT} trainees...`);

  process.stdout.write(`0% `);
  for (let i = 0; i < GENERATE_COUNT; i++) {
    const newTrainee = await saveTrainee(generateTrainee());

    // Generate profile picture
    const picGender = getNameGender(newTrainee.gender);
    const imageURL = faker.image.personPortrait({ sex: picGender });
    const imageResponse = await fetch(imageURL);
    const imageData = await imageResponse.blob();

    // Set profile picture and add assessments and interactions
    await setProfilePicture(newTrainee.id, imageData);
    await addAssessments(newTrainee, faker.number.int({ min: 0, max: 7 }));
    await addInteractions(newTrainee, faker.number.int({ min: 0, max: 20 }));
    if (EMPLOYED_JOB_PATHS.includes(newTrainee.jobPath)) {
      await addEmploymentHistory(newTrainee, faker.number.int({ min: 0, max: 3 }));
    }

    const percent = ((i + 1) / GENERATE_COUNT) * 100;
    process.stdout.write('.');
    if (percent % 10 === 0) {
      process.stdout.write(`\n${percent}%`);
    }
  }
  console.log('\n\n✅ Done. You are ready to go!');
};

main().then(console.log).catch(console.error);
