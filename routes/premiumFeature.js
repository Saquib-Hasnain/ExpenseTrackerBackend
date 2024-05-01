const express = require('express')

const premiumFeatureController = require('../contollers/premiumFeature')

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router()

router.get('/showLeaderBoard', authenticatemiddleware.authenticate, premiumFeatureController.getUserLeaderBoard)
router.get('/fileurl', authenticatemiddleware.authenticate, premiumFeatureController.FileUrlLink)

module.exports = router