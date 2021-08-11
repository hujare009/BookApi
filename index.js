require("dotenv").config();
//framework
const express = require("express");
const mongoose = require("mongoose");
//const mongoose = require("mongoose"); don't assume this line as a part of code.

//Database
const Database = require("./DataBase/index");

//Models
const BookModel = require("./DataBase/book");
const AuthorModel = require("./DataBase/author");
const PublicationModel = require("./DataBase/publication");

//initialize
const shapeAI = express();

//configure
shapeAI.use(express.json());

//Establish Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection established!!!!")); //this will shows that ur connection is established ot not.

/*   do this for all api's u'll remeber 

route           /
Description     get all books 
Access          PUBLIC
Parameters      none
Method          GET 
*/

shapeAI.get("/", async (req, res) => {
  //here it's need to insert async await
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/* 
route           /is
Description     get specific book based on ISBN 
Access          PUBLIC
Parameters      isbn
Method          GET 
*/

shapeAI.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });
  if (!getSpecificBook) {
    return res.json({
      error: `No book is found for ISBN of ${req.params.isbn}`,
    });
    // error is obj. here.
  }

  return res.json({ book: getSpecificBook });
});

/* 
route           /category also used as /c
Description     get all book based on a category
Access          PUBLIC
Parameters      category
Method          GET 
*/
shapeAI.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.findOne({
    category: req.params.category,
  });

  /*const getSpecificBooks = Database.books.filter((book) =>
    book.category.includes(req.params.category)
  );*/

  if (!getSpecificBooks) {
    return res.json({
      error: `no book is found for category of ${req.params.category}`,
    });
    // error is obj. here.
  }

  return res.json({ books: getSpecificBooks });
});

/* 
route        =   /author
Description  =   get all book based on a given authors.
Access       =   PUBLIC
Parameters   =   category
Method       =   GET 
*/

shapeAI.get("/author", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/* 
route        =   /author/:isbn
Description  =   get all book based on a given authors.
Access       =   PUBLIC
Parameters   =   book name
Method       =   GET 
*/
shapeAI.get("/author/:isbn", (req, res) => {
  const getSpecificAuthors = Database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthors });
});

/* 
route        =   /publications
Description  =   get all publication 
access       =   PUBLIC
Parameters   =   no paramitres
Method       =   GET 
*/

shapeAI.get("/publications", (req, res) => {
  return res.json({ publications: Database.publications });
});

/* 
route        =   /publication/:isbn
Description  =   get all book based on a given authors.
Access       =   PUBLIC
Parameters   =   category
Method       =   GET 
*/

shapeAI.get("/publication/:isbn", (req, res) => {
  const getSpecificpublication = Database.publication.filter((publication) =>
    publication.books.includes(req.params.isbn)
  );

  if (getSpecificpublication.length === 0) {
    return res.json({
      error: `No publication found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificpublication });
});
//add new book api
/* 
route        =   /book/new
Description  =   add new books
Access       =   PUBLIC
Parameters   =   none
Method       =   post 
*/ //to take books all entity here we can't write them all in a row it's bad and length so use BODY here

shapeAI.post("/book/new", async (req, res) => {
  const { newBook } = req.body;

  const addNewBook = BookModel.create(newBook);

  return res.json({ books: addNewBook, message: "book was added!" });
});

/* 
route        =   /author/new
Description  =   add new author
Access       =   PUBLIC
Parameters   =   none
Method       =   post
*/

shapeAI.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  // Database.authors.push(newAuthor);  ............(push keyword)
  AuthorModel.create(newAuthor);

  return res.json({ message: "author was added!" });
});

/* 
route        =   /publication/new
Description  =   add new Publication
Access       =   PUBLIC
Parameters   =   none
Method       =   post
*/

shapeAI.post("/publication/new", (req, res) => {
  const { newPublication } = req.body;
  // Database.publications.push(newPublication); ...(push keyword)
  PublicationModel.create(newPublication);
  return res.json({ message: "publication was added!" });
});

/* 
route        =   /book/update/:title
Description  =   update title of  book
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/
//upate book details -:
shapeAI.put("/book/update/:isbn", async (req, res) => {
  //here we are using foreach oe else map choose any of them
  //map => new array =>replace
  //foreach =>directly modifies the array...this is known as tradeoff

  const updatedBook = await BookModel.findOneAndUpdate(       //this will update data entity
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true,
    }
  );
  /*
  Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      return;
    }
  });
*/
  return res.json({ books: updatedBook });
});

/* 
route        =   /book/author/update/:isbn
Description  =   update/add new author
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/
//update author details -:
shapeAI.put("/book/author/update/:isbn", (req, res) => {
  // here we have to update database
  Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn)
      return book.authors.push(req.body.newAuthor);
  });

  //update the author database
  Database.authors.forEach((author) => {
    if (author.id === req.body.newAuthor)
      return author.books.push(req.params.isbn);
  });

  return res.json({
    books: Database.books,
    authors: Database.authors,
    message: "New author was added...",
  });
});

//update data of author..put req.
/* 
route        =   author/update/:title
Description  =   update name of author
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/
shapeAI.put("/author/update/:id", (req, res) => {
  Database.authors.forEach((author) => {
    if (author.ISBN === req.params.isbn) {
      author.name = req.body.authorsName;
      return;
    }
  });
  return res.json({ authors: Database.authors });
});

// UPDATE PUBLICATION DETAILS
/* 
route        =   publication/update/book
Description  =   update/add new book to a publication
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
  //update the publi. database
  Database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  //update the book database
  Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: Database.books,
    publications: Database.publications,
    message: "Successfully updated publication",
  });
});
// delete a book
/* 
route        =   book/delete
Description  =   delete a book
Access       =   PUBLIC
Parameters   =   isbn
Method       =   Delete 
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
  //deleting with for each is really hard so, we are using map here

  const updatedBookDatabase = Database.books.filter(
    (book) => book.ISBN != req.param.isbn
  );

  Database.books = updatedBookDatabase; //for update it we need book database is in let not in const.
  return res.json({ books: Database.books });
});
//update the book database..
/* 
route        =   book/delete/author
Description  =  DELETE A AUTHOR FROM A BOOK
Access       =   PUBLIC
Parameters   =   isbn
Method       =   Delete 
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });

  //update the author database
  Database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );

      author.books = newBooksList;
      return;
    }
  });

  return res.json({
    message: "author was deleted!!!",
    book: Database.books,
    author: Database.authors,
  });
});

// delete a author
/* 
route        =   /author/delete
Description  =   delete a author
Access       =   PUBLIC
Parameters   =   id
Method       =   Delete 
*/
shapeAI.delete("/author/delete/:isbn/:id", (req, res) => {
  //deleting with for each is really hard so, we are using map here

  const updatedAuthorDatabase = Database.authors.filter(
    (author) => author.Id != req.param.id
  );

  Database.authors = updatedAuthorDatabase;
  return res.json({ authors: Database.authors });
});

//delete a book from publication.
/* 
route        =   /publication/delete/book
Description  =   delete a book from publication
Access       =   PUBLIC
Parameters   =   isbn,publication id
Method       =   Delete 
*/

shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  ////update publication database
  Database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  //update book database
  Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; //no publication available
      return res.json({
        book: Database.books,
        publications: Database.publications,
      });
    }
  });
});

/* 
route        =   /publication/delete
Description  =   delete a publication
Access       =   PUBLIC
Parameters   =   id
Method       =   Delete 
*/
shapeAI.delete("/publications/delete/:isbn/:id", (req, res) => {
  //deleting with for each is really hard so, we are using map here

  const updatedpublicationDatabase = Database.publications.filter(
    (publication) => publication.Id != req.param.id
  );
  Database.publications = updatedpublicationDatabase;
  return res.json({ publications: Database.publications });
});

shapeAI.listen(3000, () => console.log("server is online!!🔥🚀"));
