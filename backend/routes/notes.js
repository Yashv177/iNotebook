const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//  Route : 1 get all the notes GET "api/notes/fetchallnotes" login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
    }
    catch(error)  {
        console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
    }
});

/// Route : 2 Add a new notes POST "api/notes/addnotes" login required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3, }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,}),
    body("tag", "Tag must be a string").isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { title, description, tag } = req.body;
        const notes = new Notes({
          title,
          description,
          tag,
          user: req.user.id,
        });
        const savedNote = await notes.save();
        res.json(savedNote);
      } catch (error) {
        return res.status(500).json({ error: "Failed to create note" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/// Route : 3 update a existing notes USING PUT "api/notes/updatenotes" login required

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be updated to update it
    const notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("Not found");
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    const note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/// Route : 4 delete a notes using DELETE "api/notes/deletenotes" login required

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted to delete it
    const notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("Not found");
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    const note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "note has been deleted", note: note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
