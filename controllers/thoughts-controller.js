const { Thoughts, Users } = require('../models');

//sets up thoughts controller
const thoughtsController = {

     //creates new thought
     createThoughts({params, body}, res) {
        Thoughts.create(body)
        .then(({_id}) => {
            return Users.findOneAndUpdate({ _id: params.userId}, {$push: {thoughts: _id}}, {new: true});
        })
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
                res.status(404).json({
                    message: 'No thoughts found with this ID!'});
                return;
            }
            res.json(dbThoughtsData)
        })
        .catch(err => res.json(err)); 
    },

        //gets all thoughts
        getAllThoughts(req, res) {
            Thoughts.find({})
            .populate({path: 'reactions', select: '-__v'})
            .select('-__v')
            .then(dbThoughtsData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
        },

        //gets thought by id
        getThoughtsById({params}, res) {
            Thoughts.findOne({_id: params.id})
            .populate({path: 'reactions', select: '-__v'})
            .select('-__v')
            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({
                        message: 'No thoughts found with that ID!'});
                        return;
                }
                res.json(dbThoughtsData)
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
        },

        //updates thought by id
        updateThoughts({params, body}, res) {
            Thoughts.findOneAndUpdate({
                __id: params.id}, body, {
                    new: true, 
                    runValidators: true})
                    .populate({path: 'reactions', select: '-__v'})
                    .select('-__v')
                    .then(dbThoughtsData => {
                        if(!dbThoughtsData) {
                            res.status(404).json({
                                message: 'No thoughts found with this ID!'
                            });
                            return;
                        }
                        res.json(dbThoughtsData);
                    })
                    .catch(err => res.json(err));
        },

        //deletes thought by id
        deleteThoughts({params}, res) {
            Thoughts.findOneAndDelete({_id: params.id})
            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({
                        message: 'No thoughts found with this ID!'
                    });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.satus(400).json(err));
        },

       //adds new Reaction
    addReaction({params, body}, res) {
        Thoughts.findOneAndUpdate({
            _id: params.thoughtId}, {
                $push: {reactions: body}}, {
                    new: true, 
                    runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({
                message: 'No thoughts found with this ID!'});
            return;
        }
        res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err))
    },

    //deletes reaction by id
    deleteReaction({params}, res) {
        Thoughts.findOneAndUpdate({
            _id: params.thoughtId}, {
                $pull: {reactions: {reactionId: params.reactionId}}}, {
                    new : true})
                    .then(dbThoughtsData => {
                        if(!dbThoughtsData) {
                            res.status(404).json({
                                message: 'No thoughts found with this ID!'});
                                return;
                        }
                        res.json(dbThoughtsData);
                    })
                    .catch(err => res.status(400).json(err));
    }
};

module.exports = thoughtsController;

    

     
  