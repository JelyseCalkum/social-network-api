const {User} = require('../models');

const userController = {

    //gets all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            //removes __v from visuals
            select: ('-__v')
        })
        .populate({
            path: 'friends',
            select: ('-__v')
        })
        .select('-__v')
        //sorts by descending order by id value
        .sort({
            _id: -1
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    //GET one user by id
    getUserById({
        params
    }, res) {
        User.findOne({
            _id: params.id
        })
        .populate({
            path: 'thoughts',
            select: ('-__v')
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    //creates user
    createUser({
        body
    }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
},

//updates user by id
updateUser({
    parrams,
    body}, res) {
        User.findOneAndUpdate({
            _id: params.id
        }, body, {
            new: true,
            runValidators: true
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({
                    message: 'No user found with that id.'
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    //deletes user
    deleteUser({
        params}, res) {
            User.findOneAndDelete({
                _id: params.id
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with that id.'
                });
                return;
            }
            return dbUserData;
            })
            .then(dbUserData => {
                User.updateMany({
                    _id: {
                        $in: dbUserData.friends
                    }
                }, {
                    $pull: {
                        friends: params.userId
                    }
                })
                .then(() => {
                    //deletes the user's thought that is associated with id
                    Thought.deleteMany({
                        username: dbUserData.username
                    })
                    .then(() => {
                        res.json({
                            message: 'The user had been deleted successfully.'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    }) 
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
        },

        //add friends
        addToFriendList({
            params
        }, res) {
            User.findOneAndUpdate({
                _id: params.userId
            }, {
                $push: {
                    friends: params.friendId
                }
            }, {
                new: true
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with that id.'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            });
        },

        //deletes friend
        removeFromFriendList({
            params
        }, res) {
            User.findOneAndDelete({
                _id: params. thoughtId
            })
            .then(deletedFriend => {
                if(!deletedFriend) {
                    return res.status(404).json({
                        message: 'No friend found with that id.'
                    })
                }
                return User.findOneAndUpdate({
                    friends: params.friendId
                }, {
                    $pull: {
                        friends: params.friendId
                    }
                }, {
                    new: true
                });
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({
                        message: 'No friend found with that id.'
                    })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        },
};

module.exports = userController;
