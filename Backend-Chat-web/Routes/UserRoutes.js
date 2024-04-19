const express=require("express")
const router=express.Router()
const controller=require("../Controllers/UserControllers")

router.post('/register',controller.addUser)
router.post('/register/otp-verification',controller.verifyOtp)
router.post('/login',controller.login)
router.post('/send-message',controller.sendMessage)
router.post('/chats',controller.showMessages)
router.post('/search-user',controller.searchUser)
router.post('/create-indipendent-account',controller.indipendentAccountCreation)


// FOR DEBUGGING -----------------------------------------------------d
router.post('/mail',controller.mailTest)
// FOR DEBUGGING -----------------------------------------------------

module.exports=router