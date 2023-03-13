const { Users } = require('../models');

//setting up Users-controller
const usersController = {

    //creates new user
    createUsers({body}, res) {
        Users.create(body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => res.status(400).json(err));
    },

    //gets all users
    getAllUsers(re, res) {
        Users.find({})
        //populates user's thoughts
        .populate({path: 'thoughts', select: '-__v'})
        //populates user's friends
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    //gets user by id
    getUsersById({params}, res) {
        Users.findOne({_id: params.id})
        //populates thoughts
        .populate({path: 'thoughts', select: '-__v'})
        //populates friends
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({
                    message: 'No user found with this ID!'});
                    return;
            }
            res.json(dbUsersData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
        .catch(err => res.json(err));
    },

    //updates user by id
    updateUsers({params, body}, res) {
        Users.findOneAndUpdate({
            _id: params.id}, body, {
                new: true, 
                runValidators: true})
                .then(dbUsersData => {
                    if(!dbUsersData) {
                        res.status(404).json({
                            message: 'No user found with that ID!'});
                        return;
                    }
                    res.json(dbUsersData);
                })
                .catch(err => res.json(err));
    },

    deleteUsers({params}, res) {
        Users.findOneAndDelete({_id: params.id})
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({
                    message: 'No User found with this ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    },

    //deletes current user by id
    addFriend({params}, res) {
        Users.findOneAndUpdate({_id: params.id}, {$push: { friends: params.friendId}}, {new: true})
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({
                    message: 'No User found with this ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },

    //deletes current friend
    deleteFriend({params}, res) {
        Users.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId}}, {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({
                    message: 'No User found with this ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = usersController;
