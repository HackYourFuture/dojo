// This script generates a list of cities in the Netherlands and appends a list of AZC locations.
// Usage: npx ts-node generate-cities.ts > cities.json

import fs from 'fs';

type City = {
  name: string;
  alternate_names: string | null;
  coordinates: { latitude: number, longitude: number } | null;
  population: number;
  country_code: string;
};

const main = async() => {
  const URL = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/exports/json?lang=en&refine=cou_name_en%3A%22Netherlands%22&facet=facet(name%3D%22cou_name_en%22%2C%20disjunctive%3Dtrue)&qv1=(netherl)&timezone=Europe%2FBerlin';
  const cities = await fetch(URL).then(response => response.json()) as City[];
  cities.map(city => {
      return {
        name: city.name,
        alternate_names: city.alternate_names,
        coordinates: city.coordinates,
        population: city.population,
        country_code: city.country_code,
      }
    })
    .concat(buildAZCList())
    .sort((city1: City, city2: City) => city1.name.replace(/^'/,'').localeCompare(city2.name.replace(/^'/,'')));

    console.log(JSON.stringify(cities, null, 4));
};
main().then().catch(console.error);

const buildAZCList = (): City[] => {
  // azc list data taken from the drop-down list on the website https://www.coa.nl/nl/locatiezoeker
  const azcList = fs.readFileSync('azc-list.txt', 'utf-8').split('\n');
  return azcList.map(azc => {
    return {
      name: azc,
      alternate_names: null,
      coordinates: null,
      population: 0,
      country_code: "NL"
    }
  });
};