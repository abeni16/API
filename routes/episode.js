const express = require('express');
const PostPodcast = require('../models/podcast_model');
const router = express.Router();

/*  
    localhost:3000/podcasts
    shows all the list of podcast with episode in the database
*/
router.get('/', async (req,res) => {
    try {
        res.send("HELLO");
    } catch (error) {
        res.json({message:error})
    }
});


/*
    search a episode name using episode name
*/
router.get('/:episode_name', async (req, res)=>{
    try {
        const result = await PostPodcast.find({episodes:{$elemMatch:{"episode_name":req.params.episode_name}}});
        res.json(result);
    } catch (error) {
        res.json({message:error});
    }
});

/*
    delete a episode by episode ID
*/
router.delete('/:episodeID', async (req, res)=>{
    try {
        // console.log(req.params.episodeID);
        const id_finder = await PostPodcast.find({episodes:{$elemMatch:{"_id": req.params.episodeID}}});
        const id = JSON.stringify(id_finder[0]._id);
        const phase_one = id.substring(id.indexOf('"') + 1);
        const get_podcast_id = phase_one.replace('"',"");

        const deletePodcast = await PostPodcast.updateMany({"_id": get_podcast_id},{$pull:{episodes:{"_id":req.params.episodeID}}});
        // console.log(deletePodcast);
        res.json(deletePodcast);
    } catch (error) {
        res.json({message:error});
    }
});

/*
    Update a episode by episode ID
*/
router.put('/:episode_id', async (req, res)=>{
    try {
        const id_finder = await PostPodcast.find({episodes:{$elemMatch:{"_id": req.params.episode_id}}});

        const edit_episode = await PostPodcast.updateMany({
            "episodes.episode_name":id_finder[0].episodes[0].episode_name
        },
        {$set:{
            "episodes.$.episode_name": req.body.episode_name,
            "episodes.$.episode_category": req.body.episode_category,
            "episodes.$.episode_length": req.body.episode_length,
            "episodes.$.episode_description": req.body.episode_description,
            "episodes.$.episode_released_date": req.body.episode_released_date
        }},{new:true});

        res.json(edit_episode);
    } catch (error) {
        res.json({message:error});
    }
});
module.exports = router;