
const express = require('express')

const userController = require('../contollers/user')

const router = express.Router();

router.post('/signup', userController.signup)
router.post('/login', userController.login)


module.exports = router

