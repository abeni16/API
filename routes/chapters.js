const express = require("express");
const AudioBook = require("../models/audioBook");
const router = express.Router();

/*  
    localhost:3000/audiobooks
    shows all the list of audiobook with episode in the database
*/
router.get("/", async (req, res) => {
  try {
    res.send("HELLO");
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/:audiobook_id/epsiode", async (req, res) => {
  try {
    const result = await AudioBook.findById(req.params.audiobook_id);
    res.json(result.chapter);
  } catch (error) {
    res.json({ message: error });
  }
});
router.get("/:audiobook_id/epsiode/:epsiode_id", async (req, res) => {
  try {
    const result = await AudioBook.findById(req.params.audiobook_id);
    res.json(result.chapter.id(req.params.epsiode_id));
  } catch (error) {
    res.json({ message: error });
  }
});
/*
    search a episode name using episode name
*/
router.get("/:episode_id", async (req, res) => {
  try {
    const result = await AudioBook.findById(req.params.episode_id);
    res.json(result.chapter._id(req.params.episode_id));
  } catch (error) {
    res.json({ message: error });
  }
});

/*
    delete a episode by episode ID
*/
router.delete("/:episodeID", async (req, res) => {
  try {
    // console.log(req.params.episodeID);
    const id_finder = await AudioBook.find({
      chapter: { $elemMatch: { _id: req.params.episodeID } },
    });
    const id = JSON.stringify(id_finder[0]._id);
    const phase_one = id.substring(id.indexOf('"') + 1);
    const get_audiobook_id = phase_one.replace('"', "");

    const deleteaudiobook = await AudioBook.updateMany(
      { _id: get_audiobook_id },
      { $pull: { chapter: { _id: req.params.episodeID } } }
    );
    // console.log(deleteaudiobook);
    res.json(deleteaudiobook);
  } catch (error) {
    res.json({ message: error });
  }
});

/*
    Update a episode by episode ID
*/
router.put("/:episode_id", async (req, res) => {
  try {
    const id_finder = await AudioBook.find({
      chapter: { $elemMatch: { _id: req.params.episode_id } },
    });

    const edit_chapter = await AudioBook.updateMany(
      {
        "chapter.chapter_name": id_finder[0].chapter[0].chapter_name,
      },
      {
        $set: {
          "chapter.$.chapter_name": req.body.chapter_name,
          "chapter.$.chapter_audio": req.body.chapter_audio,
          "chapter.$.chapter_category": req.body.chapter_category,
          "chapter.$.chapter_length": req.body.chapter_length,
          "chapter.$.chapter_description": req.body.chapter_description,
          "chapter.$.chapter_released_date": req.body.chapter_released_date,
        },
      },
      { new: true }
    );

    res.json(edit_chapter);
  } catch (error) {
    res.json({ message: error });
  }
});
module.exports = router;
