const router = require('express').Router();


//sets user and thought routes
const usersRoutes = require('./user-routes');
const thoughtsRoutes = require('./thought-routes');

//adds /users to routes
router.use('/users', usersRoutes);

//adds /thoughts to routes
router.use('/thoughts',thoughtsRoutes);

module.exports = router;