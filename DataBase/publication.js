const mongoose = require("mongoose");

//creating PublicationSchema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: String,
});

//Publication Model
const PublicationModel = mongoose.model("publications",PublicationSchema);

//export
module.exports = PublicationModel;

