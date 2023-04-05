const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.delete('/', controller.tokenAuthenticator, controller.logout)

module.exports = router;