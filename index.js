const booksUrl = 'http://localhost:3000/books';
const usersUrl = 'http://localhost:3000/users';

let currentUser = {id: 1};

document.addEventListener("DOMContentLoaded", init);

function init() {
  getCurrentUser();
  getBooks();
};

function getCurrentUser() {
  fetch(usersUrl)
  .then(r => r.json())
  .then(json => {
    json.forEach(user => {
      if (user.id === 1) {
        currentUser.username = user.username;
      }
    })
  })
}

function getBooks() {
  fetch(booksUrl)
  .then(r => r.json())
  .then(json => json.forEach(book => renderListBook(book)));
};

function getOneBook(id) {
  fetch(`${booksUrl}/${id}`)
  .then(r => r.json())
  .then(json => renderBookInfo(json));
};

function patchBookUsers(id) {
  let bookFinished = false;
  const bookUsers = {
    users: []
  };
  const usersList = document.querySelector(`#users-book-${id}`).querySelectorAll('p');
  usersList.forEach(user => {
    bookUsers.users.push({
      id: Number(user.dataset.userId),
      username: user.innerText
    });
  });

  if (bookUsers.users.find(user => user.id === 1)) {
    let i = bookUsers.users.findIndex(user => user.id === 1);
    bookUsers.users.splice(i, 1);
  } else {
    bookUsers.users.push({id: currentUser.id, username: currentUser.username});
  };

  fetch(`${booksUrl}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(bookUsers),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(r => r.json())
  .then(json => renderBookInfo(json));
};

function renderListBook(book) {
  const bookList = document.querySelector('#list');
  const bookElement = document.createElement('li');
  bookElement.id = `book-${book.id}`;
  bookElement.innerText = book.title;
  bookElement.addEventListener('click', e => getOneBook(e.target.id.split('-')[1]));
  bookList.appendChild(bookElement);
};

function renderBookInfo(book) {
  const showPanel = document.querySelector('#show-panel');
  showPanel.innerHTML = '';

  const bookTitle = document.createElement('h2');
  const bookImage = document.createElement('img');
  const bookDescription = document.createElement('p');
  const usersDiv = document.createElement('div');
  const readBookButton = document.createElement('button');

  bookTitle.innerText = book.title;
  bookImage.src = book.img_url;
  bookDescription.innerText = book.description;
  usersDiv.id = `users-book-${book.id}`;
  readBookButton.innerText = 'Read Book';
  readBookButton.id = `read-book-${book.id}`;
  readBookButton.addEventListener('click', e => {
    // patch to books/:id to add user to users list
    const bookId = e.target.id.split('-')[2];
    patchBookUsers(bookId);
    // console.log(e);
  })

  showPanel.appendChild(bookTitle);
  showPanel.appendChild(bookImage);
  showPanel.appendChild(bookDescription);
  book.users.forEach(user => {
    usersDiv.appendChild(renderUserInfo(user));
  })
  showPanel.appendChild(usersDiv);
  showPanel.appendChild(readBookButton);
};

function renderUserInfo(user) {
  const bookUser = document.createElement('p');
  bookUser.dataset.userId = user.id;
  bookUser.innerHTML = `<strong>${user.username}</strong>`;
  return bookUser;
};
