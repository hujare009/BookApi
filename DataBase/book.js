//we need mongoose here so we put "require"
const mongoose = require("mongoose");

//creating a book Schema
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  authors: [Number],
  langauge: String,
  pubDate: String,
  numOfPage: Number,
  category: [String],
  publications: Number,
});

//Create a Book Model = for that call mongoose & then call model methode & pass the schema as a parameter
const BookModel = mongoose.model("books",BookSchema);

//to use this model evrywhere we are exporting it.
module.exports = BookModel;
