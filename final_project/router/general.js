const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let bookList = { books: books };
    return res.status(200).json(bookList);
});

// Retrieve book information using a Promise
public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
      get_books.then(() => console.log("Task 10"));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Retrieve book information by isbn using a Promise
public_users.get('/books/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const findBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    });
    findBook
      .then((book) => res.status(200).json(book)) 
      .catch((error) => res.status(404).json({ message: error.message }));
  });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const book = Object.values(books).filter(book => book.author === author);
    let bookList = { booksbyauthor: book };
    if (book.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

// Retrieve book information by author using a Promise
public_users.get('/books/author/:author', function (req, res) {
    const author = req.params.author;
    const findBooksByAuthor = new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error('No books found'));
      }
    });
    findBooksByAuthor
      .then((booksByAuthor) => res.status(200).json({ booksbyauthor: booksByAuthor }))
      .catch((error) => res.status(404).json({ message: error.message }));
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const book = Object.values(books).filter(book => book.title === title);
    let bookList = { booksbytitle: book };
    if (book.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

// Retrieve book information by title using a Promise
public_users.get('/books/title/:title', function (req, res) {
    const title = req.params.title;
    const findBooksByTitle = new Promise((resolve, reject) => {
        const booksByTitle = Object.values(books).filter(book => book.title === title);
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject(new Error('No books found'));
        }
    });
    findBooksByTitle
        .then((booksByTitle) => res.status(200).json({ booksbytitle: booksByTitle }))
        .catch((error) => res.status(404).json({ message: error.message }));
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        let bookList = { reviews: book.reviews };
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
