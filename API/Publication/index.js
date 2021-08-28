const Router = require("express").Router();

/* 
route        =   /publications
Description  =   get all publication 
access       =   PUBLIC
Parameters   =   no paramitres
Method       =   GET 
*/

Router.get("/", (req, res) => {
    return res.json({publications: Database.publications});
});

/* 
route        =   /publication/:isbn
Description  =   get all book based on a given authors.
Access       =   PUBLIC
Parameters   =   category
Method       =   GET 
*/

Router.get("/:isbn", (req, res) => {
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
route        =   /publication/new
Description  =   add new Publication
Access       =   PUBLIC
Parameters   =   none
Method       =   post
*/

Router.post("/new", (req, res) => {
  const { newPublication } = req.body;
  // Database.publications.push(newPublication); ...(push keyword)
  PublicationModel.create(newPublication);
  return res.json({ message: "publication was added!" });
});

/* 
route        =   publication/update/book
Description  =   update/add new book to a publication
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/
Router.put("/update/book/:isbn", (req, res) => {
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

/* 
route        =   /publication/delete/book
Description  =   delete a book from publication
Access       =   PUBLIC
Parameters   =   isbn,publication id
Method       =   Delete 
*/

Router.delete("/delete/book/:isbn/:pubId", (req, res) => {
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
Router.delete("/delete/:isbn/:id", (req, res) => {
  //deleting with for each is really hard so, we are using map here

  const updatedpublicationDatabase = Database.publications.filter(
    (publication) => publication.Id != req.param.id
  );
  Database.publications = updatedpublicationDatabase;
  return res.json({ publications: Database.publications });
});


module.exports = Router;