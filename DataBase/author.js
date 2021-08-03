const mongoose = require("mongoose");

//creating BookSchema
const AuthorSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: String,
});

//author Model
const AuthorModel = mongoose.model("authors",AuthorSchema);

//export
module.exports = AuthorModel;
