import Suggestion from "../models/Suggestion.js";

export const getSuggestions = async (req, res) => {
  const data = await Suggestion.find();
  res.json(data);
};

export const addSuggestion = async (req, res) => {
  const newSuggestion = new Suggestion(req.body);
  await newSuggestion.save();
  res.json({ message: "Added ✔" });
};

export const deleteSuggestion = async (req, res) => {
  await Suggestion.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted ✔" });
};
