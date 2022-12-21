import axios from 'axios';
import Notiflix from 'notiflix';
import { page, dataInput } from '../index';

export const fetchImages = async () => {
  const params = new URLSearchParams({
    key: '31954114-91698a6aaff5e78891de897c8',
    q: dataInput.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });

  const url = `https://pixabay.com/api/?${params}`;

  const response = await axios
    .get(url)
    .then(function (response) {
      // handle success

      if (response.data.hits.length === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (
        response.data.totalHits < 41 ||
        (response.data.totalHits > 40 && page === 1)
      ) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }

      return response;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      Notiflix.Notify.error(
        'We are sorry, but getting images is impossible in that moment'
      );
    });

  return response;
};

/* async/await function
export const fetchImages = async () => {
  const url = `https://pixabay.com/api/?${params}`;

  const response = await fetch(url);
  const fetchResult = await response.json();

  return fetchResult;
};
*/
