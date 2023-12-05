import axios from 'axios';
//бібліотека для обробки селекту
//npm install slim-select
import SlimSelect from 'slim-select';
//npm i notiflix
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
axios.defaults.headers.common['x-api-key'] =
  'live_0h6gWU7nqCgXTyBDNuNjMFGmNzBMJ1pY0FmHBqh87swJtLjlQOpuPp9ZMsqYbble';

const breedSelection = document.querySelector('select.breed-select');
const loading = document.querySelector('.loader');
const ERROR = document.querySelector('.error');
const informationForCat = document.querySelector('.cat-info');

new SlimSelect({
  select: '#single',
});

breedSelection.classList.add('hidden');
ERROR.classList.add('hidden');

fetchBreeds()
  .then(resolve => {
    loading.classList.add('hidden');
    breedSelection.classList.remove('hidden');
    const selectMarkup = resolve
      .map(
        //додаємо котиків
        item => `<option value="${item.id}">${item.name}</option>`
      )
      .join('');

    return (breedSelection.innerHTML = selectMarkup);
  })
  .catch(error => {
    ERROR.classList.remove('hidden');
    breedSelection.classList.add('hidden');
    Notiflix.Notify.warning(
      'Oops! Something went wrong! Try reloading the page!'
    );
    console.log(error);
  });
breedSelection.addEventListener('change', handleSelection);

function handleSelection(event) {
  loading.classList.add('hidden');
  breedSelection.classList.remove('hidden');
  ERROR.classList.add('hidden');

  const breedId = event.target.value;
  fetchCatByBreed(breedId)
    .then(catData => {
      loading.classList.add('hidden');
      breedSelection.classList.remove('hidden');
      ERROR.classList.add('hidden');

      const { breeds, url } = catData;
      const { description, name, temperament } = breeds[0];
      const catInfo = `
            <img class = "fotoCat" src = "${url}" alt = "${name}" width ="400" heght ="300">
            <div>
                <h1>${name}</h1>
                <p>${description}</p>
                <h3>${temperament}</h3>
            </div>
            `;
      return (informationForCat.innerHTML = catInfo);
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.warning(
        'Oops! Something went wrong! Try reloading the page!'
      );
      ERROR.classList.remove('hidden');
      breedSelection.classList.add('hidden');
    });
}
