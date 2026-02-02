import express from "express";

const router = express.Router();

// TEMP in-memory data (will reset when server restarts)
let suggestions = [
  { id: 1, title: "Winter Trend", desc: "Navy blue and charcoal outfits are trending." },
  { id: 2, title: "Traditional Tip", desc: "Light kurta with dark churidar gives a premium look." }
];

// GET ALL
router.get("/", (req, res) => {
  res.json(suggestions);
});

// ADD NEW
router.post("/", (req, res) => {
  const { title, desc } = req.body;

  const newItem = {
    id: Date.now(),
    title,
    desc
  };

  suggestions.push(newItem);
  res.json({ success: true, data: newItem });
});

// UPDATE
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, desc } = req.body;

  const index = suggestions.findIndex(s => s.id == id);
  if (index === -1) return res.status(404).json({ success: false });

  suggestions[index] = { id: Number(id), title, desc };
  res.json({ success: true, data: suggestions[index] });
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  suggestions = suggestions.filter(s => s.id != id);
  res.json({ success: true });
});

export default router;
