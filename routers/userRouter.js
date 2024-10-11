const router = require("express").Router()

const {
    signUp_user, 
    logIn, 
    logOut,
    createProfileImg, 
    deleteProfileImg,  
    changePassword, 
    resetPassword, 
    inpute_reset_code, 
    forgotPassword, 
    getOne, 
    createTransactionPin, 
    resendRecoveryCode } = require("../controllers/userController")

const {
    signUp,
    forgotValidation,
    changePasswordValidation, 
    resetPasswordValidation, 
    loginValidation, 
    transferPinValidation} = require("../validations/validation")

const upload = require("../media/multer")
const authenticate = require("../auth/userAuth")

router.post('/signUp', signUp, signUp_user)
router.post("/logIn", loginValidation, logIn)
router.post("/create_pin", authenticate, transferPinValidation, createTransactionPin)
router.post("/logout", authenticate, logOut)
router.post('/profileImg', authenticate, upload.single('profileImg'), createProfileImg)
router.get('/get_user', authenticate, getOne)
router.delete('/delete/profileImg', authenticate, deleteProfileImg)
router.post('/forgot_password/:id',forgotValidation, forgotPassword)
router.post('/resend_recoveryCode/:id', resendRecoveryCode)
router.post('/recover/code/:id', inpute_reset_code)
router.post('/reset_password/:id',resetPasswordValidation, resetPassword)
router.put('/change_password', authenticate, changePasswordValidation, changePassword)


module.exports = router