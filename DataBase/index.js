let books = [
  {
    ISBN: "123456ONE",
    title: "Getting started with MERN ",
    authors: [1, 2],
    langauge: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category: ["fiction", "programming", "tech", "web dev"],
    publications: 1,
  },

  {
    ISBN: "123456two",
    title: "Getting started with java",
    authors: [1, 2],
    langauge: "java",
    pubDate: "2021-07-07",
    numOfPage: 350,
    category: ["fiction", "tech", "web dev"],
    publication: 1,
  },
];
//---------------------------------------------------------------------------------------------------------
let authors = [
  {
    id: 1,
    name: "shubham",
    books: ["1234ONE", "123456two"],
  },
  {
    id: 2,
    name: "abhay",
    books: ["1234ONE"],
  },
];
//--------------------------------------------------------------------------------------------------------
const publications = [
  {
    id: 1,
    name: "chakra",
    books: "123456ONE",
  },
  {
    id: 2,
    name: "sam",
    books: [],
  },
];
//-----------------------------------------------------------------------------------------------------
module.exports = { books, authors, publications };
