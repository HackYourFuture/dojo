import { MongoClient } from 'mongodb';
import countriesJSON from './geo-data/dojo.countries.json';
import citiesJSON from './geo-data/dojo.cities.json';

export const testUser = {
  _id: 'y6J0Fbva',
  name: 'Dojo Test',
  email: 'dojo.hyf.test@gmail.com',
  imageUrl: 'https://dojo-test.ams3.cdn.digitaloceanspaces.com/images/users/y6J0Fbva.png',
  isActive: true,
};

const pushTestUser = async (client: MongoClient) => {
  const usersCollection = client.db().collection('users');
  await usersCollection.updateOne({ _id: testUser._id as any }, { $set: testUser }, { upsert: true });
};

const pushCountries = async (client: MongoClient) => {
  const countries = client.db().collection('countries');
  const count = await countries.countDocuments();
  if (count > 0) {
    return;
  }

  await countries.insertMany(
    countriesJSON.map((country) => {
      return {
        ...country,
        _id: country._id as any, // bypassing typescript type check
      };
    })
  );
};

const pushCities = async (client: MongoClient) => {
  const cities = client.db().collection('cities');
  const count = await cities.countDocuments();
  if (count > 0) {
    return;
  }
  await cities.insertMany(citiesJSON);
};

export const setupDB = async (mongoURI: string) => {
  const client = new MongoClient(mongoURI, { connectTimeoutMS: 5000 });
  try {
    console.log(`  ➡️ Connecting to MongoDB at ${mongoURI}`);
    await client.connect();
  } catch (error) {
    throw `  ❌ Could not connect to MongoDB. Please ensure it's running and reachable at ${mongoURI}\nError: ${error}`;
  }
  console.log('  ✅ Connected to MongoDB successfully.');

  try {
    console.log('  ➡️ Creating test user...');
    await pushTestUser(client);
    console.log('  ➡️ Creating collections for countries and cities...');
    await pushCountries(client);
    await pushCities(client);
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
};
