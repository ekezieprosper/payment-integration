const router = require("express").Router()

const { 
    fundWallet,
    callBackUrl, 
    getBanks, 
    bankDetails, 
    withdrawfunds } = require("../controllers/walletController")

const authenticate = require("../auth/userAuth")


router.post('/deposit', fundWallet)
router.post('/paystack/callback', callBackUrl)
router.post('/bank_details', authenticate, bankDetails)
router.post('/withdrawfunds', authenticate, withdrawfunds)
router.get('/getbanks', getBanks)

module.exports = router