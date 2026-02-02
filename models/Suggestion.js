import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  title: String,
  shirtColor: String,
  pantColor: String,
  description: String,
});

export default mongoose.model("Suggestion", suggestionSchema);
