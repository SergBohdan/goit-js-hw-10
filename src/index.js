import axios from "axios";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";
import { fetchBreeds, fetchCatByBreed } from "./cat-api";

const breedSelect = document.querySelector(".breed-select");
const catInfo = document.querySelector(".cat-info");
const catImage = document.getElementById("cat-image");
const breedName = document.getElementById("breed-name");
const description = document.getElementById("description");
const temperament = document.getElementById("temperament");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");

axios.defaults.headers.common["x-api-key"] = 'live_Dq44YXXBnPhjGJSYGzdEvz1lu0LsZVcgpHtUwh0Yvi0uDrpSRyf5nA810k9996tR';

// Функція для показу або приховування елемента
const toggleElement = (element, show) => {
  element.classList.toggle("non-active", !show);
};

// Оновлення вмісту select з породами
const updateBreedSelect = (breeds) => {
  breedSelect.innerHTML = breeds.map(({ id, name }) => `<option value="${id}">${name}</option>`).join("");
  toggleElement(breedSelect, true);
  toggleElement(loader, false);
};

// Оновлення інформації про кота
const updateCatInfo = ({ url, breeds }) => {
  catImage.src = url;
  [breedName.textContent, description.textContent, temperament.textContent] = breeds[0];
  toggleElement(catInfo, true);
};

// Отримання інформації про кота за породою
const fetchCatInfo = async (breedId) => {
  try {
    const cat = await fetchCatByBreed(breedId);
    updateCatInfo(cat);
  } catch (error) {
    toggleElement(error, true);
  }
};

// Обробка запиту за списком порід при завантаженні сторінки
window.addEventListener("load", async () => {
  toggleElement(loader, true);

  try {
    const breeds = await fetchBreeds();
    updateBreedSelect(breeds);

    const slimSelect = new SlimSelect({
      select: ".breed-select",
      showSearch: false
    });

    breedSelect.addEventListener("change", (event) => {
      const breedId = event.target.value;
      toggleElement(catInfo, false);
      toggleElement(loader, true);
      fetchCatInfo(breedId);
    });
  } catch (error) {
    toggleElement(error, true);
  }
});