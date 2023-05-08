/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    books: {
      book: '.book',
      bookImage: '.book__image',
    },

  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML)
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.render();
      thisBooksList.getElements();
      thisBooksList.initActions();
    }

    initData() {
      const thisBooksList = this;

      thisBooksList.favouriteBooks = [];
      thisBooksList.checkedFilters = [];
    }

    getElements() {
      const thisBooksList = this;
      thisBooksList.book = document.querySelector(select.containerOf.booksList);
      thisBooksList.filters = document.querySelectorAll(select.containerOf.filters);

    }


    render() {
      const thisBooksList = this;
      for (let book of dataSource.books) {
        const bck = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidht = book.rating * 10;
        book.ratingWidht = ratingWidht;
        book.ratingBgc = bck;
        const generatedHTML = templates.book(book);
        thisBooksList.element = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.bookContainer = document.querySelector(select.containerOf.booksList);
        thisBooksList.bookContainer.appendChild(thisBooksList.element);
      }
    }

    initActions() {
      const thisBooksList = this;
      thisBooksList.book.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const clickedElement = event.target;
        if (clickedElement.offsetParent.classList.contains('book__image')) {
          if (!thisBooksList.favouriteBooks.includes(clickedElement.offsetParent.getAttribute('data-id'))) {
            clickedElement.offsetParent.classList.add('favorite');
            thisBooksList.favouriteBooks.push(clickedElement.offsetParent.getAttribute('data-id'));
          } else {
            clickedElement.offsetParent.classList.remove('favorite');
            const index = thisBooksList.favouriteBooks.indexOf(clickedElement.offsetParent.getAttribute('data-id'));
            thisBooksList.favouriteBooks.splice(index, 1);
          }
          console.log(thisBooksList.favouriteBooks);
        }
      });



      for (let filter of thisBooksList.filters) {
        filter.addEventListener('change', function (event) {
          event.preventDefault();
          const clickedElement = event.target;
          console.log(clickedElement);
          if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
            if (clickedElement.checked) {
              thisBooksList.checkedFilters.push(clickedElement.value);

            } else {
              const index = thisBooksList.checkedFilters.indexOf(clickedElement.value);
              thisBooksList.checkedFilters.splice(index, 1);
            }
          }
          console.log(thisBooksList.checkedFilters);
          thisBooksList.filterBooks();
        });

      }
    }

    filterBooks() {
      const thisBooksList = this;
      const books = dataSource.books;
      for (let book of books) {

        let shouldBeHidden = false;
        for (let filter of thisBooksList.checkedFilters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }

        }
        console.log(book);
        const elem = document.querySelector('.book__image[data-id="' + book.id + '"]');
        console.log('elem', elem);
        if (shouldBeHidden) {
          elem.classList.add('hidden');
        } else {
          elem.classList.remove('hidden');
        }
      }

    }

    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }
  new BooksList();

}