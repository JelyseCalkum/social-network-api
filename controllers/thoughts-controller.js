const {
    Thought,
    User
} = require('../models');
const thoughtController = {
    //gets all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //gets one thought via id
    getThoughtsById({
        params
    }, res) {
        Thought.findOne({
            _id: params.id
        })
        .select('-__v')
        .sort({
            _id: -1
        })
        .then(dbThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({
                    message: 'Thought not found by id.'
                }); 
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //creates new thought
    addThought({
        body
    }, res) {
        Thought.create(body)
        .then((ThoughtData) => {
            return User.findOneAndUpdate(
                //creates thought using current user
                {
                    _id: body.userId
                }, {
                    $addToSet: {
                        thoughts: ThoughtData._id
                    }
                }, {
                    new: true
                }
            );
        })
        .then(dbUsersData => {
            if (!dbusersData) {
                res.status(404).json({
                    message: 'No user found.'
                });
                return;
            }
            res.json(dbUsersData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //updats thought via id
    updateThought({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $set: body
            }, {
                runValidators: true,
                new: true
            })
            .then(updateThought => {
                if (!updateThought) {
                    return res.status(404).json({
                        message: 'No thought with this id!'
                    });
                }
                return res.json({
                    message: "Success"
                });
            })
            .catch(err => res.json(err));
    },

    //delete thought
    removeThought({
        params
    }, res) {
        Thought.findOneAndDelete({
                _id: params.thoughtId
            })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({
                        message: 'No thought with this id!'
                    });
                }
                return User.findOneAndUpdate({
                    thoughts: params.thoughtId
                }, {
                    $pull: {
                        thoughts: params.thoughtId
                    }
                }, {
                    new: true
                });
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No thought found with this id!'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    //creates reaction
    addReaction({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $push: {
                    reactions: body
                }
            }, {
                new: true,
                runValidators: true
            })
            .then(updatedThought => {
                if (!updatedThought) {
                    res.status(404).json({
                        message: 'No reaction found with this id!'
                    });
                    return;
                }
                res.json(updatedThought);
            })
            .catch(err => res.json(err));
    },
    //deletes reaction
    removeReaction({
        params
    }, res) {
        Thought.findOneAndUpdate({
                    _id: params.thoughtId
                },
                //allows to remove the reaction by id
                {
                    $pull: {
                        reactions: {
                            reactionId: params.reactionId
                        }
                    }
                }, {
                    new: true
                }
            )
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({
                        message: 'No reaction found with this id.'
                    });
                    return;
                }
                res.json(thought)
            })
            .catch(err => res.json(err));
    },
}

    

     
  