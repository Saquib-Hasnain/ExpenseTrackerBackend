const express = require('express')
const resetpasswordController = require('../contollers/forgetpassword')
const router = express.Router()
router.post('/forgotpassword', resetpasswordController.forgotpassword)
router.get('/resetpassword/:id', resetpasswordController.resetpassword)
router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)


module.exports = router