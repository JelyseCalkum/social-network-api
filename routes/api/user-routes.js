const router = require('express').Router();

const {
    getAllUsers,
    gerUserById,
    createUser,
    updateUser,
    deleteUser,
    addToFriendList,
    removeFromFriendList
} = require('../../controllers/user-controller');

//sets up GET all and POST at .../api/users
router.route('/').get(getAllUsers).post(createUser);

//sets up GET one, PUT, DELETE at .../api/users/<user-id>
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

router.route('/userId/friends/:friendId').post(addToFriendList);

router.route('/:userId/friends/:friendId').delete(removeFromFriendList);

module.exports = router;