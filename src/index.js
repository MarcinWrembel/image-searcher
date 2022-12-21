'use strict';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetch';
import debounce from 'lodash.debounce';

const loadMoreBtn = document.querySelector('.load-more');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const moveUpBtn = document.querySelector('.to-top-btn');

export const dataInput = document.querySelector('[name="searchQuery"]');
export let page = 1;

//create lightBox
let lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function loadImages() {
  fetchImages().then(e => {
    let imagesList = e.data.hits;

    let totalImg = e.data.totalHits;

    const shorterImageList = imagesList.reduce((acc, val) => {
      //destructure of main promise result
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = val;

      //creating new array object element with less properties
      acc.push({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      });

      return acc;
    }, []);

    //function which creates set of cards
    generateCards(shorterImageList);

    //refresh lightBox
    lightBox.refresh();

    if (totalImg === gallery.childElementCount) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );

      //hide button when maximum of hits is reached
      loadMoreBtn.classList.add('js-display');
      return;
    }

    loadMoreBtn.classList.toggle('js-display');

    // console.log(
    //   `hits: ${totalHits} , loaded images: ${gallery.childElementCount}`
    // );
  });
}

//create set of images cards
function generateCards(data) {
  data.map(el => {
    createImageCard(el);
  });
}

//create single image card element
function createImageCard(singleImage) {
  let imageWrapper = document.createElement('div');
  imageWrapper.setAttribute('class', 'photo-card');

  let imageCard = document.createElement('img');
  imageCard.classList.add('photo-card__img' );
  imageCard.setAttribute('src', singleImage.webformatURL);
  imageCard.setAttribute('alt', singleImage.tags);
  imageCard.setAttribute('loading', 'lazy');

  //create link tag for SimpleLightBox functionality
  let imageLink = document.createElement('a');
  imageLink.classList.add('photo-card__link');
  imageLink.setAttribute('href', singleImage.largeImageURL);


  let imageInfo = document.createElement('div');
  imageInfo.setAttribute('class', 'photo-card__info');

  //info section
  let imageLikes = document.createElement('p');
  let imageLikesDesc = document.createElement('span');
  imageLikes.setAttribute('class', 'photo-card__info-item');
  imageLikes.textContent = singleImage.likes;
  imageLikesDesc.setAttribute('class','photo-card__info-heading');
  imageLikesDesc.textContent = 'Likes';

  let imageViews = document.createElement('p');
  let imageViewsDesc = document.createElement('span');
  imageViews.setAttribute('class', 'photo-card__info-item');
  imageViews.textContent = singleImage.views;
  imageViewsDesc.setAttribute('class','photo-card__info-heading');
  imageViewsDesc.textContent = 'Views';

  let imageComments = document.createElement('p');
  let imageCommentsDesc = document.createElement('span');
  imageComments.setAttribute('class', 'photo-card__info-item');
  imageComments.textContent = singleImage.comments;
  imageCommentsDesc.setAttribute('class','photo-card__info-heading');
  imageCommentsDesc.textContent = 'Comments';

  let imageDownloads = document.createElement('p');
  let imageDownloadsDesc = document.createElement('span');
  imageDownloads.setAttribute('class', 'photo-card__info-item');
  imageDownloads.textContent = singleImage.downloads;
  imageDownloadsDesc.setAttribute('class','photo-card__info-heading');
  imageDownloadsDesc.textContent = 'Downloads';

  //add elements to HTML
  gallery.insertAdjacentElement('beforeend', imageWrapper);

  imageWrapper.insertAdjacentElement('beforeend', imageInfo);
  imageWrapper.insertAdjacentElement('afterbegin', imageLink);

  imageLink.insertAdjacentElement('afterbegin', imageCard);

  imageInfo.insertAdjacentElement('afterbegin', imageDownloads);
  imageInfo.insertAdjacentElement('afterbegin', imageComments);
  imageInfo.insertAdjacentElement('afterbegin', imageViews);
  imageInfo.insertAdjacentElement('afterbegin', imageLikes);

  imageDownloads.appendChild(imageDownloadsDesc);
  imageComments.appendChild(imageCommentsDesc);
  imageViews.appendChild(imageViewsDesc);
  imageLikes.appendChild(imageLikesDesc);
}

//Load additional images from totalHits for next pages.
function loadMore() {
  page++;
  loadImages();
}

//window.scrollY - value of scrolled page
//document.documentElement.offsetHeight -height of whole page
//window.innerHeight - browser window height

//percentage of scrolling: window.scrollY/(document.documentElement.offsetHeight-window.innerHeight)*100

//Loading images on form submit
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  loadImages();
});

//Additional images load
loadMoreBtn.addEventListener('click', loadMore);

//Scroll functionality
const moveOnTop = e => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

//move on top when clicked
moveUpBtn.addEventListener('click', moveOnTop);

document.addEventListener(
  'scroll',
  debounce(() => {
    let positionY = window.scrollY;

    if (positionY === 0) {
      moveUpBtn.classList.add('js-display');
    } else {
      moveUpBtn.classList.remove('js-display');
    }
  }, 300)
);

//Prevent from starting search using Enter key
// searchForm.addEventListener('keydown', event => {
//   if (event.keyCode == 13) {
//     event.preventDefault();
//     return false;
//   }
// });
