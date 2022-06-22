import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let inputValue = e.target.value.trim();

  if (inputValue === '') {
    clearListCountry();
    clearInfoCountry();
  } else {
    fetchCountries(inputValue)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
          clearListCountry();
          clearInfoCountry();
        } else if (data.length >= 2 && data.length <= 10) {
          clearInfoCountry();
          refs.countryList.innerHTML = renderMarkupList(data);
        } else {
          clearListCountry();
          refs.countryInfo.innerHTML = renderMarkupInfo(data);
        }
      })
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

const renderMarkupList = country => {
  return country
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
      <img src="${flags.svg}" alt="${name.common}" class="country-list_img">
      <span class="country-list__name">${name.common}</span></li>`;
    })
    .join('');
};

const renderMarkupInfo = country => {
  return country
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class="country-info__name"><img src="${flags.svg}" alt="${
        name.common
      }" class="country-info__img" />${name.official}</div>
        <p><span class="country-info__bold">Capital: </span>${capital}</p>
        <p><span class="country-info__bold">Population: </span>${population}</p>
        <p><span class="country-info__bold">Languages: </span>${Object.values(
          languages
        ).join(', ')}</p>`;
    })
    .join('');
};

const clearListCountry = () => {
  refs.countryList.innerHTML = '';
};

const clearInfoCountry = () => {
  refs.countryInfo.innerHTML = '';
};
