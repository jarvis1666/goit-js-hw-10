//npm i axios
import axios from 'axios';

//ключ до api з котами
axios.defaults.headers.common['x-api-key'] =
  'live_0h6gWU7nqCgXTyBDNuNjMFGmNzBMJ1pY0FmHBqh87swJtLjlQOpuPp9ZMsqYbble';
const url = 'https://api.thecatapi.com/v1/breeds';

function fetchBreeds() {
  return axios
    .get(url)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      throw new Error(error);
    }); // Викидаємо помилку для обробки вище
}

//Запит про кота на ресур при його виборі
function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(({ data }) => {
      const catData = data[0];
      return catData;
    })
    .catch(error => {
      console.log(error);
    });
}
//  додаємо експорт функції
export { fetchBreeds, fetchCatByBreed };
