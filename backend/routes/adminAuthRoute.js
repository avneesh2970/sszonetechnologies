const express = require('express')
const AdminController = require('../controllers/adminAuthController')

const adminMiddleware = require('../middleware/admin')

const adminRouter = express.Router()

adminRouter.post('/login',  AdminController.loginAdminController)
adminRouter.put('/update-password' , adminMiddleware , AdminController.updateAdminPassword)
// ✅ Step 1: Verify old password
adminRouter.post("/verify-password", adminMiddleware, AdminController.verifyPassword);


module.exports = adminRouter