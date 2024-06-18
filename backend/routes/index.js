const express = require('express');

const router = express.Router();
const index_controllers = require('../controllers/index');

// router.get('/', index_controllers);

router.post('/sign-in', index_controllers.sign_in_post);

router.post('/sign-up', index_controllers.sign_up_post);

router.get('/authentication-check', index_controllers.authentication_check_get);

router.get('/logout', index_controllers.logout_get);

module.exports = router;
