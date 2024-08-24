//API-CAT
import axios from 'axios';

const API_KEY = 'live_iY0Yt9hDjXmxbWA5Wt60sUl2X60xECNo4bGVCN82MGzXtDVrQqXKbaoVAEX9IG9G';
const ENDPOINT = 'https://api.thecatapi.com/v1';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export default class CatList {
    constructor({ selector }) {
        this.element = this.selector(selector);
    }
    select(selector) {
        return document.querySelector(selector);
    }
    hide() {
        this.element.classList.add('hidden');
    }
    show() {
        this.element.classList.remove('hidden');
    }
     async getCats() {
    try {
      const { data } = await axios.get(`${ENDPOINT}/breeds`);
      return data;
    } catch (err) {
      return console.error(err);
    }
  }
  async getCatInfo(breedId) {
    try {
      const { data } = await axios.get(
        `${ENDPOINT}/images/search?breed_ids=${breedId}`
      );
      return data;
    } catch (err) {
      return console.error(err);
    }
  }
}

// INDEX.JS
import CatList from './api-cat.js';
import { Notify } from 'notiflix';

const selector = new CatList({
  selector: '.breed-select',
});
const display = new CatList({
  selector: '.cat-info',
});
const loader = new CatList({
  selector: '.cat-info__loader',
});

const fetchBreeds = () => {
  
  selector
    .getCats()
    .then(data => {
      if (data) {
       
        loader.hide();
      }
      const placeHolder =
        '<option value="" selected class="placeholder">Please select a cat</option>';
      selector.element.insertAdjacentHTML('afterbegin', placeHolder);
      data.forEach(cat => {
       
        const { name, id } = cat;
        const breed = `<option class="option" value="${id}">${name}</option>`;
        selector.element.insertAdjacentHTML('beforeend', breed);
      });
    })
    .catch(() => Notify.failure('No cats been found , please try reload page'));
};

const fetchCatByBreed = id => {
  selector
    .getCatInfo(id)
    .then(data => {
      const [
        {
          url,
          breeds: [{ name, description, temperament }],
        },
      ] = data; // Destructuring data recived from axios
      const displayedCat = `<img src="${url}" alt="${name}" height="auto" width="500px"><div class="text-box">
        <h1 class="text"> ${name}</h1>
        <h2 class="text"> ${temperament}</h2>
        <p class="text"> ${description}</p></div>`;
      display.element.insertAdjacentHTML('afterbegin', displayedCat);
    })
    .catch(() => Notify.failure('No cats been found , please try reload page'));
};

const resetDisplay = () => (display.element.innerHTML = '');

fetchBreeds();
selector.element.addEventListener('change', e => {
  const selectedCat = e.currentTarget.value;
  if (document.querySelector('.placeholder')) {
    document.querySelector('.placeholder').remove();
  }
  resetDisplay();
  fetchCatByBreed(selectedCat);
});