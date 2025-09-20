const express = require("express")
const announcementController = require("../controllers/announcementCont")

const router = express.Router()

router.post('/announcement' ,announcementController.announcement )
router.get('/getannouncement' ,announcementController.getAnnouncement )
router.put('/announcement/:id', announcementController.updateAnnouncement);
router.delete('/announcement/:id', announcementController.deleteAnnouncement);


module.exports = router