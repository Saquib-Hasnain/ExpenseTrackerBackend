const express = require("express")
const expenseController = require("../contollers/expense")
const userAuthentication = require("../middleware/auth")

const router = express.Router()
router.post('/addexpense', userAuthentication.authenticate, expenseController.addexpense)
router.get('/getexpense', userAuthentication.authenticate, expenseController.getexpense)
router.delete('/deleteexpense/:expenseid', userAuthentication.authenticate, expenseController.deleteexpense)
router.get('/download', userAuthentication.authenticate, expenseController.downloadexpense)

module.exports = router