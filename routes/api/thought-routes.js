const router = require('express').Router();

const {
    getAllthoughts,
    getThoughtById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction,
} = require('../../controllers/thought-controller');

//api/thoughts
router.route('/').get(getAllThoughts).post(addThought);

router.route('/:thoughtId').get(getThoughtById).put(updateThought).delete(removeThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionid').delete(removeReaction);


module.exports = router;