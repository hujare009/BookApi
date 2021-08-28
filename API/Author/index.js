const Router = require("express").Router();

const AutorModel = require("../../DataBase/author");
//(../../=these are the relative path who took us at start.)

/* 
route        =   /author
Description  =   get all book based on a given authors.
Access       =   PUBLIC
Parameters   =   category
Method       =   GET 
*/

Router.get("/", async (req, res) => {
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
Router.get("/:isbn", (req, res) => {
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
route        =   /author/new
Description  =   add new author
Access       =   PUBLIC
Parameters   =   none
Method       =   post
*/

Router.post("/new", (req, res) => {
  const { newAuthor } = req.body;
  // Database.authors.push(newAuthor);  ............(push keyword)
  AuthorModel.create(newAuthor);

  return res.json({ message: "author was added!" });
});

/* 
route        =   author/update/:title
Description  =   update name of author
Access       =   PUBLIC
Parameters   =   isbn
Method       =   put 
*/
Router.put("/update/:id", (req, res) => {
  Database.authors.forEach((author) => {
    if (author.ISBN === req.params.isbn) {
      author.name = req.body.authorsName;
      return;
    }
  });
  return res.json({ authors: Database.authors });
});

/* 
route        =   /author/delete
Description  =   delete a author
Access       =   PUBLIC
Parameters   =   id
Method       =   Delete 
*/
Router.delete("/delete/:isbn/:id", (req, res) => {
  //deleting with for each is really hard so, we are using map here

  const updatedAuthorDatabase = Database.authors.filter(
    (author) => author.Id != req.param.id
  );

  Database.authors = updatedAuthorDatabase;
  return res.json({ authors: Database.authors });
});

module.exports = Router;
