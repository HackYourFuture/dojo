// This script generates a list of countries
// Usage: npx ts-node generate-countries.ts > countries.json

type Country = {
  name: { common: string };
  flag: string;
  cca2: string;
};

const main = async() => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flag,cca2');
  const countries = await response.json() as Country[];
  const formattedCountries = countries.map(country => {
    return {
      name: country.name.common,
      flag: country.flag,
      code: country.cca2,
      _id: country.cca2
    }
  }).sort((country1, country2) => country1.name.localeCompare(country2.name));
  console.log(JSON.stringify(formattedCountries));
};

main().then().catch(console.error);