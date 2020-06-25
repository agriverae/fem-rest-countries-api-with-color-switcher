import {
  getAllCountries,
  getCountryInfo,
  createSelect,
  createInput,
  createContainerFilter,
  createCountryCards,
  createDetailCountryInfo,
  themeObj
} from "./utils.js";

let countries = [];
let countriesLoaded = false;
let countriesSelected = [];
let themeColor = "light";

document.addEventListener('DOMContentLoaded', () => {
  
  // -------------------------------------------------

  const changeTheme = () => {
    themeColor = themeColor === "light" ? "dark" : "light";
    const root = document.documentElement;
    const themeInfo = themeObj[themeColor];

    Object.keys(themeInfo).forEach( themeKey => {
      if(themeKey.includes('--'))
        root.style.setProperty(`${themeKey}`, themeInfo[themeKey])
    })
    
    const themeButton = document.querySelector('.theme-button')

    themeButton.innerHTML = themeInfo.themeButton;
  }

  const loadCountriesUI = async () => {
    const main = document.querySelector('main');
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards-container');
    const filterContainer = createContainerFilter(createInput(), createSelect());
    main.innerHTML = filterContainer;
    main.appendChild(cardsContainer);
    cardsContainer.textContent = 'Loading'

    if(!countriesLoaded){
      countries = await getAllCountries();
      countriesLoaded = true;
    }

    countriesSelected = countries;

    cardsContainer.innerHTML = createCountryCards(countries)

      // Listeners
    const countryInput = document.querySelector('.filter-container .country-input');

    const countriesFoundContext = () => {
      let timeout = null;

      return (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if(countriesLoaded){
            const countriesFound = countriesSelected
              .filter(({name}) => name.toLowerCase().includes(e.target.value.toLowerCase()))
    
            cardsContainer.innerHTML = createCountryCards(countriesFound)
          }
        }, 500);   
      }
    }

    const regionSelect = document.querySelector('#region');

    regionSelect.addEventListener('change', e => {
      countriesSelected = e.target.value === "All" ? countries : 
      countries.filter(({region}) => region.toLowerCase().includes(e.target.value.toLowerCase()))

      countryInput.value = "";

      cardsContainer.innerHTML = createCountryCards(countriesSelected)
    })

    countryInput.addEventListener('keydown', countriesFoundContext())

    cardsContainer.addEventListener('click', (e) => {
      const countryCard = e.target.closest('.country-card');
      if(countryCard){
        loadCountryDetailUI(countryCard.dataset.code)
      }
    })
  }

  const loadCountryDetailUI = async (code) => {
    const main = document.querySelector('main');
    main.textContent = 'Loading';
    const countryInfo = await getCountryInfo(code);

    main.innerHTML = createDetailCountryInfo(countryInfo);
    
    const selBorderButtons = document.querySelectorAll('.border-button');  
    const backButton = document.querySelector('.back-button');

    selBorderButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        loadCountryDetailUI(e.target.dataset.border);
      })
    })

    backButton.addEventListener('click', () => {
      loadCountriesUI();
    });
  }

  (async () => {
    const themeButton = document.querySelector('.theme-button');
    themeButton.addEventListener('click', changeTheme);
    await loadCountriesUI();

  })();

})