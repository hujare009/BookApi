//initializing Express router
const Router = require("express").Router();

// Database Models
const BookModel = require("../../DataBase/book");

/*   do this for all api's u'll remeber 
//---------------------------------1
route           /
Description     get all books 
Access          PUBLIC
Parameters      none
Method          GET 
*/

Router.get("/", async (req, res) => {
  //here it's need to insert async await
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});
//---------------------------------2
/* 
route           /is
Description     get specific book based on ISBN 
Access          PUBLIC
Parameters      isbn
Method          GET 
*/

Router.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });
  if (!getSpecificBook) {
    return res.json({
      error: `No book is found for ISBN of ${req.params.isbn}`,
    });
    // error is obj. here.
  }

  return res.json({ book: getSpecificBook });
});
//---------------------------------3
/* 
route           /category also used as /c
Description     get all book based on a category
Access          PUBLIC
Parameters      category
Method          GET 
*/
Router.get("/c/:category", async (req, res) => {
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
//---------------------------------4
/* 
route        =   /book/new
Description  =   add new books
Access       =   PUBLIC
Parameters   =   none
Method       =   post 
*/ //to take books all entity here we can't write them all in a row it's bad and length so use BODY here

Router.post("/new", async (req, res) => {
  const { newBook } = req.body;

  const addNewBook = BookModel.create(newBook);

  return res.json({ books: addNewBook, message: "book was added!" });
});

/*
Route            /book/update
Description      update title of a book
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

Router.put("/update/:isbn", async (req, res) => {
  //here we are using foreach oe else map choose any of them
  //map => new array =>replace
  //foreach =>directly modifies the array...this is known as tradeoff

  const updatedBook = await BookModel.findOneAndUpdate(
    //this will update data entity
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

  return res.json({ books: updatedBook });
});
//--------------------------------------------5
/* 5
route        =   /book/update/:isbn
Description  =   update title of  book
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/
//upate book details -:
Router.put("/update/:isbn", async (req, res) => {
  //here we are using foreach oe else map choose any of them
  //map => new array =>replace
  //foreach =>directly modifies the array...this is known as tradeoff

  const updatedBook = await BookModel.findOneAndUpdate(
    //this will update data entity
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

  Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      return;
    }
  });

  return res.json({ books: updatedBook });
});

//---------------------------------6
/* 
route        =   /book/author/update/:isbn
Description  =   update/add new author
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put
*/
//add & update author details -:
Router.put("/author/update/:isbn", async (req, res) => {
  // here we have to updating the book database.

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: { authors: req.body.newAuthor },
    },
    { new: true }
  );

  /* Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn)
      return book.authors.push(req.body.newAuthor);
  });
*/
  //update the author database.

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: { books: req.params.isbn },
    },
    {
      new: true,
    }
  );

  /*
  Database.authors.forEach((author) => {
    if (author.id === req.body.newAuthor)
      return author.books.push(req.params.isbn);
  });
*/
  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New author was added...",
  });
});

//-----------------------------------------------------------7

/* 
route        =   book/delete
Description  =   delete a book
Access       =   PUBLIC
Parameters   =   isbn
Method       =   Delete 
*/
Router.delete("/delete/:isbn", async (req, res) => {
  //deleting with for each is really hard so, we are using map here

  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  /* const updatedBookDatabase = Database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );*/
  return res.json({ books: Database.books });
});
//update the book database..
/* 
route        =   book/delete/author
Description  =   DELETE A AUTHOR FROM A BOOK
Access       =   PUBLIC
Parameters   =   isbn
Method       =   Delete 
*/
Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        authors: parseInt(req.params.authorId),
      },
    },
    { new: true }
  );

  /*Database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });*/

  //update the author database
  /* Database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );

      author.books = newBooksList;
      return;
    }
  });*/

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );

  return res.json({
    message: "author was deleted!!!",
    book: updatedBook,
    author: updatedAuthor,
  });
});

module.exports = Router;
