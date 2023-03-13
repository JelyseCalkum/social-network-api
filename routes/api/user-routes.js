const router = require('express').Router();

const {
    getAllUsers,
    getUsersById,
    createUsers,
    updateUsers,
    deleteUsers,
    addFriend,
    deleteFriend
} = require('../../controllers/users-controller');

// GET, POST /api/users
router.route('/').get(getAllUsers).post(createUsers);

// GET, PUT, DELETE /api/users/:id
router.route('/:id').get(getUsersById).put(updateUsers).delete(deleteUsers);

// POST, DELETE /api/users/:userId/friends/:friendId
router.route('/:id/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;