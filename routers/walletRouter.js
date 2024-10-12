const router = require("express").Router()

const { 
    fundWallet,
    callBackUrl, 
    getBanks, 
    bankDetails, 
    withdrawfunds } = require("../controllers/walletController")

const authenticate = require("../auth/userAuth")


router.post('/deposit', authenticate, fundWallet)
router.post('/paystack/callback', callBackUrl)
router.get('/allbanks', authenticate, getBanks)
router.get('/searchbank', authenticate, bankDetails)
router.post('/withdrawfunds', authenticate, withdrawfunds)

module.exports = router