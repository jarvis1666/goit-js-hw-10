import axios from 'axios';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

axios.defaults.headers.common['x-api-key'] =
  'live_0h6gWU7nqCgXTyBDNuNjMFGmNzBMJ1pY0FmHBqh87swJtLjlQOpuPp9ZMsqYbble';

const breedSelection = document.querySelector('select.breed-select');
const loading = document.querySelector('.loader');
const ERROR = document.querySelector('.error');
const informationForCat = document.querySelector('.cat-info');

breedSelection.classList.add('hidden');
ERROR.classList.add('hidden');

fetchBreeds()
  .then(resolve => {
    loading.classList.add('hidden');
    breedSelection.classList.remove('hidden');
    const selectMarkup = resolve
      .map(item => `<option value="${item.id}">${item.name}</option>`)
      .join('');
    breedSelection.innerHTML = selectMarkup;
    new SlimSelect({
      select: '.breed-select',
    });
    return;
  })
  .catch(error => {
    breedSelection.classList.add('hidden');
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
    console.log(error);
  });

breedSelection.addEventListener('change', handleSelection);

function handleSelection(event) {
  loading.classList.remove('hidden');
  breedSelection.classList.add('hidden');
  ERROR.classList.add('hidden');

  const breedId = event.target.value;
  informationForCat.innerHTML = ''; // Очистимо попередню інформацію про кота

  fetchCatByBreed(breedId)
    .then(catData => {
      loading.classList.add('hidden');
      breedSelection.classList.remove('hidden');

      if (!catData || !catData.breeds || catData.breeds.length === 0) {
        Notiflix.Notify.failure(
          'Oops! Something went wrong! Try reloading the page!'
        );
        return;
      }

      const { breeds, url } = catData;
      const { description, name, temperament } = breeds[0];
      const catInfo = `
            <img class="fotoCat" src="${url}" alt="${name}" width="500" height="400">
            <div class="infoCat">
                <h1>${name}</h1>
                <p>${description}</p>
                <h3>${temperament}</h3>
            </div>
            `;
      informationForCat.innerHTML = catInfo;
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      breedSelection.classList.add('hidden');
      loading.classList.add('hidden');
      ERROR.classList.remove('hidden');
    });
}
