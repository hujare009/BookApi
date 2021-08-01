//framework
const express = require("express");

//Database
const Database = require("./DataBase/index");

//initialize
const shapeAI = express();

//configure
shapeAI.use(express.json());

/*   do this for all api's u'll remeber 

route           /
Description     get all books 
Access          PUBLIC
Parameters      none
Method          GET 
*/

shapeAI.get("/", (req, res) => {
  return res.json({ books: Database.books });
});

/* 
route           /is
Description     get all book isbn
Access          PUBLIC
Parameters      isbn
Method          GET 
*/

shapeAI.get("/is/:isbn", (req, res) => {
  const getSpecificBook = Database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book is found for ISBN of ${req.params.isbn}`,
    });
    // error is obj. here.
  }

  return res.json({ book: getSpecificBook });
});

/* 
route           /category also used as c/
Description     get all book based on a category
Access          PUBLIC
Parameters      category
Method          GET 
*/
shapeAI.get("/c/:category", (req, res) => {
  const getSpecificBooks = Database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `no book is for found category of ${req.params.category}`,
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

shapeAI.get("/author", (req, res) => {
  return res.json({ authors: Database.authors });
});

/* 
route        =   /author
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
route        =   /author
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

/* 
route        =   /book/new
Description  =   add new books
Access       =   PUBLIC
Parameters   =   none
Method       =   post 
*/ //to take books all entity here we can't write them all in a row it's bad and length so use BODY here

shapeAI.post("/book/new", (req, res) => {
  const { newBook } = req.body;
  Database.books.push(newBook); //push keyword
  return res.json({ books: Database.books, messege: "book was added" });
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
  Database.authors.push(newAuthor); //push keyword
  return res.json({ authors: Database.authors, messege: "author was added" });
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
  Database.publications.push(newPublication); //push keyword
  return res.json({
    publications: Database.publications,
    messege: "Publication was added",
  });
});

/* 
route        =   /book/update/:title
Description  =   update title of  book
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
  //here we are using foreach oe else map choose any of them
  //map => new array =>replace
  //foreach =>directly modifies the array...this is known as tradeoff
  Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      return;
    }
  });

  return res.json({ books: Database.books });
});

/* 
route        =   /book/author/update/:isbn
Description  =   update/add new author
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/

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
    if(book.ISBN === req.params.isbn){
      book.publication = 0; //no publication available
      return res.json({book: Database.books, publications: Database.publications})
    }
  });
});

shapeAI.listen(3002, () => console.log("server is online!!🚀🔥"));
