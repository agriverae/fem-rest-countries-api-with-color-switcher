const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
const baseUrl = 'https://restcountries.eu/rest/v2/';


// GENERAL
const curry = (func) => {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

// URLS

const fetchAndParseInfo = async (url) => {
  const result = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    })
  return result;
}

export const getAllCountries = () => fetchAndParseInfo(`${baseUrl}all`);

export const getCountryInfo = async (code) => await fetchAndParseInfo(`${baseUrl}alpha/${code}`);

// DOM CREATORS

export const createDetails = curry((title, customPop, customRegion, customCapital) => (
  `<div class="country-details">
    ${title}
    ${customPop}
    ${customRegion}
    ${customCapital}
  </div>`
));


const createTitle = (name) => `<h1 class="country-title">${name}</h1>`;

const createCustomParagraph = (name, value) => `<p><strong>${name}: </strong>${value}</p>`;

const createImg = ({ flag, name}) => `<div class="card-container">
  <img src="${flag}" alt="${name}" >
</div>`;

export const createSelect = () => {
  const options = regions.map(createOption);
  
  return `<select name="region" id="region">
  <option selected hidden disabled>Filter By Region</option> 
  ${options.join('')}
  </select>`;
}

const createOption = (value) => `<option value="${value}">${value}</option>`

export const createInput = () => `<input class="country-input" placeholder="Search for a country..." />`;

const createButton = (text, className, dataObject) => 
  `<button
    ${dataObject? `data-${dataObject.name}="${dataObject.value}"` : ''}
    ${className? `class=${className}` : ''}
  >
    ${text}
  </button>`;



export const createContainerFilter = (input, select) => `<div class="filter-container">
  <div id="input-container">${input}</div>
  <div class="select">${select}</div>
</div>`;

const countryDetails = ({name, population, region, capital}) => createDetails
(createTitle(name))
(createCustomParagraph('Population', population))
(createCustomParagraph('Region', region))
(createCustomParagraph('Capital', capital));

export const createCountryCards = (countries) => countries.map(country => 
  createCountryCard(country.alpha3Code)(countryDetails(country))(createImg(country))
).join('');

const createCountryCard = curry((code, countryDetails, imageInfo) => (
  `<section data-code="${code}" class="country-card">
    ${imageInfo}
    ${countryDetails}
  </section>`
));

export const createDetailCountryInfo = ({
  name,
  nativeName,
  flag,
  population,
  region,
  subregion,
  capital,
  topLevelDomain,
  currencies,
  languages,
  borders,
}) => {

  const borderButtons = borders.map(border => createButton(border, "border-button", {name: 'border', value: border})).join('');
  const parsedLanguages = languages.map(lang => lang.name).join(', ')
  const parsedCurrencies = currencies.map(curr => curr.name).join(', ')
  const button = createButton(`<i class="fas fa-arrow-left"></i>Back`, "back-button");
  const flagImage = createImg({name, flag});
  const countryTitle = createTitle(name);
  const customPop = createCustomParagraph('Population', population);
  const customNativeName = createCustomParagraph('Native Name', nativeName);
  const customRegion = createCustomParagraph('Region', region);
  const customSubRegion = createCustomParagraph('Sub Region', subregion);
  const customCapital = createCustomParagraph('Capital', capital);    
  const customLang = createCustomParagraph('Languages', parsedLanguages)
  const customCurr = createCustomParagraph('Currencies', parsedCurrencies);
  const customDomain = createCustomParagraph('Top Level Domain', topLevelDomain[0]);

  return `${button}
  <div class="country-information">
    ${flagImage}
    <div class="country-details">
      ${countryTitle}
      <div class="country-misc">
        ${customNativeName}
        ${customDomain}
        ${customPop}
        ${customCurr}
        ${customRegion}
        ${customLang}
        ${customSubRegion}
        ${customCapital}
      </div>
      <div class="country-borders">
        <p><strong>Border Countries: </strong></p>
        ${borderButtons}
      </div>
    </div>
  </div>`;
}

export const themeObj = {
  dark: {
    themeButton: "<i class=\"far fa-moon\"></i>Light Mode",
    "--background-color": "hsl(207, 26%, 17%)",
    "--element-color": "hsl(209, 23%, 22%)",
    "--text-color": "hsl(0, 0%, 100%)",
    "--input-color": "hsl(0, 0%, 100%)"
  },
  "light": {
    themeButton: "<i class=\"far fa-moon\"></i>Dark Mode",
    "--background-color": "hsl(0, 0%, 98%)",
    "--element-color": "hsl(0, 0%, 100%)",
    "--text-color": "hsl(200, 15%, 8%)",
    "--input-color": "hsl(0, 0%, 52%)"
  }
}