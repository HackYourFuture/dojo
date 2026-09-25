import { Client } from 'pg';
import { faker } from './random.js';
import { createHash } from 'crypto';
import countriesJSON from './geo-data/dojo.countries.json' with { type: "json" };
import citiesJSON from './geo-data/dojo.cities.json' with { type: "json" };


export const testUser = {
  id: faker.string.alphanumeric(10),
  name: 'Dojo Test',
  email: 'dojo.hyf.test@gmail.com',
  isActive: true,
  apiToken: 'DOJOTEST',
};

const pushTestUser = async (client) => {
  const sql = `
    INSERT INTO users (id, email, name, is_active, created_at, updated_at) 
    VALUES ($1, $2, $3, $4, NOW(), NOW());
  `;
  await client.query(sql, [testUser.id, testUser.email, testUser.name, testUser.isActive]);
};

const pushAPIToken = async (client) => {
  const tokenHash = createHash('sha256').update(testUser.apiToken).digest('hex');
  const sql = `
    INSERT INTO tokens (id, type, token_hash, user_id, expires_at, created_at, updated_at) 
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW());
  `;
  await client.query(sql, [faker.string.alphanumeric(10), 'API_TOKEN', tokenHash, testUser.id, '3000-01-01 00:00:00']);
};

export const setupDB = async ({ host, port, user, password, database }) => {
  const client = new Client({ host, port, user, password, database });
  try {
    console.log(`  ➡️ Connecting to postgresql://${host}:${port}/${database} as ${user}`);
    await client.connect();
  } catch (error) {
    throw `  ❌ Could not connect to PostgreSQL. Please ensure it's running and reachable at ${host}:${port}/${database}\nError: ${error}`;
  }
  console.log('  ✅ Connected to PostgreSQL successfully.');

  try {
    console.log('  ➡️ Creating test user...');
    await pushTestUser(client);
    console.log('  ➡️ Creating API token...');
    await pushAPIToken(client);
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
};
