/**
 * Dojo Database Setup Script
 *
 * Usage: npx ts-node index.ts
 *
 * Prerequisites:
 * - MongoDB instance running
 * - .env file configured in the server root directory.
 * - Dojo server running locally (npm run dev)
 *
 * The script will generate 500 trainees by default (configurable via GENERATE_COUNT).
 */

import fs from 'fs';
import { Trainee } from '../../src/models/Trainee';
import { ResponseError } from '../../src/models/ResponseError';
import { randomStrikeNumber, getNameGender } from './random-helpers';
import { faker } from '@faker-js/faker';
import { generateTrainee } from './generators/traineeGenerator';
import { generateStrike } from './generators/strikeGenerator';
import { setupDB, testUser } from './setupDB';
import { generateInteraction } from './generators/interactionGenerator';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { TokenService } from '../../src/services/TokenService';
import { createInterface } from 'readline/promises';
import { generateTest } from './generators/testGenerator';

// Config
const MONGO_URI = 'mongodb://localhost:27017/dojo';
const BASE_URL = 'http://localhost:7777/api';
const GENERATE_COUNT = 500;

const introStep = async () => {
  const message = `
  🛠️  Welcome to the Dojo Database Setup Script!
  🛠️  This script will help you set up your Dojo database with test data.

  Please make sure you have done the following before running this script:
  1. Your MongoDB instance is running at ${MONGO_URI}
  2. The server .env file has been configured correctly.
  3. The Dojo server is running locally (npm run dev) and reachable at ${BASE_URL}.

  Press Enter to begin...
  `;
  console.log(message);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  await rl.question('');
};

const checkEnvFileStep = () => {
  const envFilePath = path.resolve(__dirname, '../../.env');
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
    await setupDB(MONGO_URI);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const extractJWTSecretStep = () => {
  // Path to .env file (two directories up)
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  // Access JWT_SECRET
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error(`❌ JWT_SECRET is not defined in .env file. Please make sure your .env is set up correctly.`);
    process.exit(1);
  }
  return JWT_SECRET;
};

const tokenGenerationStep = (JWT_SECRET: string) => {
  const tokenService = new TokenService(JWT_SECRET, 1);
  return tokenService.generateAccessToken({ ...testUser, id: testUser._id });
};

const testUserTokenStep = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/session`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      console.error(`❌  User token invalid. Server returned HTTP ${response.status}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Could not connect to Dojo server at ${BASE_URL}. Please ensure the server is running.`);
    console.error('   Make sure to start the server with "npm run dev" in the server directory.');
    process.exit(1);
  }
};

const saveTrainee = async (token: string, trainee: Trainee) => {
  const url = `${BASE_URL}/trainees`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(trainee),
  });

  const body = await response.json();
  if (!response.ok) {
    const responseError = body as ResponseError;
    console.error(`Failed to save trainee: HTTP ${responseError.error}`);
  }

  return body as Trainee;
};

const addStrikes = async (token: string, trainee: Trainee, count: number) => {
  const url = `${BASE_URL}/trainees/${trainee.id}/strikes`;
  const promises = new Array(count).fill(0).map(() => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(generateStrike(trainee)),
    });
  });
  await Promise.all(promises);
};

const addTests = async (token: string, trainee: Trainee, count: number) => {
  const url = `${BASE_URL}/trainees/${trainee.id}/tests`;
  const promises = new Array(count).fill(0).map(() => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(generateTest(trainee)),
    });
  });
  await Promise.all(promises);
};

const addInteractions = async (token: string, trainee: Trainee, count: number) => {
  const url = `${BASE_URL}/trainees/${trainee.id}/interactions`;
  const promises = new Array(count).fill(0).map(() => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(generateInteraction(trainee)),
    });
  });

  await Promise.all(promises);
};

const setProfilePicture = async (token: string, traineeID: string, imageBlob: Blob) => {
  const url = `${BASE_URL}/trainees/${traineeID}/profile-picture`;
  const formData = new FormData();
  formData.append('profilePicture', imageBlob);
  const response = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return response.ok;
};

const main = async () => {
  await introStep();
  checkEnvFileStep();
  await setupDBStep();
  console.log('✅ Database setup completed successfully.\n');

  console.log('➡️ Generating test user token...');
  const JWT_SECRET = extractJWTSecretStep();
  const token = tokenGenerationStep(JWT_SECRET);
  console.log('✅ Test user token generated successfully.\n');

  console.log('➡️ Testing token...');
  await testUserTokenStep(token);
  console.log('✅ Token is valid. The server is running.\n');

  console.log(`➡️ Starting trainee generation. Will generate ${GENERATE_COUNT} trainees...`);

  process.stdout.write(`0% `);
  for (let i = 0; i < GENERATE_COUNT; i++) {
    //Generate random trainee and save in Dojo
    const newTrainee = await saveTrainee(token, generateTrainee());

    // Set profile picture
    const picGender = getNameGender(newTrainee.personalInfo.gender);
    const imageURL = faker.image.personPortrait({ sex: picGender });
    const imageResponse = await fetch(imageURL);
    const imageData = await imageResponse.blob();

    // Set profile picture and add strikes, tests and interactions
    await setProfilePicture(token, newTrainee.id, imageData);
    await addStrikes(token, newTrainee, randomStrikeNumber());
    await addTests(token, newTrainee, faker.number.int({ min: 0, max: 7 }));
    await addInteractions(token, newTrainee, faker.number.int({ min: 0, max: 12 }));

    const percent = ((i + 1) / GENERATE_COUNT) * 100;
    process.stdout.write('.');
    if (percent % 10 === 0) {
      process.stdout.write(`\n${percent}%`);
    }
  }
  console.log('\n\n✅ Done. You are ready to go!');
};

main().then(console.log).catch(console.error);
