const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThoughts,
    updateThoughts,
    deleteThoughts,
    addReaction,
    deleteReaction,
} = require('../../controllers/thoughts-controller');

// GET /api/thoughts 
router.route('/').get(getAllThoughts)//.post(addThought)
;
// GET, PUT, DELETE /api/thoughts/:id
router.route('/:id').get(getThoughtsById).put(updateThoughts).delete(deleteThoughts); 

// POST /api/thoughts/:userId
router.route('/userId').post(createThoughts);

// POST /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// DELETE /api/thoughts/:thoughtId/reactionId
router.route('/:thoughtId/reactions/:reactionid').delete(deleteReaction);


module.exports = router;