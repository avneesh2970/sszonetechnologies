const express = require("express")
const router = express.Router()

const contactController = require('../controllers/contactController')


router.post('/contactUs', contactController.contactDetails)
router.get('/contactdata', contactController.getContactData)

module.exports = router