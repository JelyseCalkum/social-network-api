// Require express router
const router = require('express').Router();

// Set requirements (from thoughts-controller)
const { 
    getAllThoughts, 
    getThoughtsById, 
    createThoughts, 
    updateThoughts,
    deleteThoughts,
    addReaction,
    deleteReaction

} = require('../../controllers/thoughts-controller');

// GET /api/thoughts 
router.route('/').get(getAllThoughts);

// GET, PUT, DELETE /api/thoughts/:userid 
router.route('/:id').get(getThoughtsById).put(updateThoughts).delete(deleteThoughts); 

// POST /api/thoughts/:userId 
router.route('/:userId').post(createThoughts);

// POST /api/thoughts/:thoughtId/reactions 
router.route('/:thoughtId/reactions').post(addReaction);

// DELETE reaction /api/thoughts/thoughtID/reactions/reactionID
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

// Export module router
module.exports = router;