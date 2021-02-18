var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var passport = require('passport');

/* GET home page. */
router.post('/register', user_controller.register);
router.post('/login', user_controller.login);
router.post('/logout', passport.authenticate('jwt', {session: false}), user_controller.logout);
router.get('/friends', user_controller.friends_get);
router.get('/friendRequests', user_controller.get_friend_requests);
router.post('/friendRequests', user_controller.send_friend_request);
router.post('/processFriendRequest', user_controller.process_friend_request)
//router.get('/verify', user_controller.verify);

module.exports = router;