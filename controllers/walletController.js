const axios = require('axios')
const crypto = require('crypto')
const Banks = require("../enums/availableBanks")
const userModel = require("../models/userModel")
const bankModel = require("../models/bankModel")
require("dotenv").config()
const { createWriteStream } = require("fs")

const url = 'https://api.paystack.co/transaction/initialize'

exports.fundWallet = async (req, res) => {
    try {
        const id = req.user.userId
        const { amount} = req.body

        const user = await userModel.findOne({ _id: id })
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            })
        }

        const initiateTransfer = await axios.post(
            url,
            {
                email: user.email,
                amount: amount * 100,
                metadata: {
                    user_id: user._id
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const response = initiateTransfer.data.data

        res.status(200).json({
            message: 'Transaction initiated successfully',
            data: response
        })
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error' 
    })
  }
}


exports.callBackUrl = async (req, res) => {
    try {
        const { reference } = req.query

        // verify the transaction
        const transaction = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
                }
            }
        )
        console.log("response:",transaction)

        // get the verification response
        const response = transaction.data

        // check the transaction status
        if (response.status !== "true" && response.data.status !== "success") {
            return res.status(200).json({
                error: "payment failed"
            })
        }

        // extract the user's id and amount paid
        const userId = response.data.metadata.user_id
        const amount = response.data.amount

        // find the user and update balance
        const user = await userModel.findById(userId)

        // update the user's balance
        user.acctBalance += amount / 100
        await user.save()

        res.status(200).json({
            message: 'Successful',
            details: {
                paymentDate: response.data.paid_at
            }
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


exports.getBanks = async (req, res) => {
    try {
        const allAvailableBanks = await axios.get(
            'https://api.paystack.co/bank',
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
                }
            }
        )
        const extractBank = allAvailableBanks.data.data
        const filterBank = extractBank.filter(banks => {
            const availableBanks = Banks
            return availableBanks.includes(banks.name)
        })
        return res.status(200).json({
            lenths: filterBank.length,
            banks: filterBank
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}


exports.bankDetails = async (req, res) => {
    try {
        const  id  = req.user.userId
        const { acctNumber, bankCode } = req.body

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        // validate the bank details
        const getBank = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${acctNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        const response = getBank.data.data

        const saveBankDetails = await bankModel.create({
            acctNumber,
            bankCode,
            user: id,
            ref_code: response.recipient_code,
        })

        user.BankDetails.push(saveBankDetails._id)
        await user.save()

        res.status(200).json({
            message: "Bank details added successfully",
            data: response,
            bank: saveBankDetails,
        })

    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
}


exports.withdrawfunds = async (req, res) => {
    try {
        const id = req.user.userId
        const { amount, ref } = req.body

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                error: "user not found"
            })
        }

        // check if the user balance is eligible to make the withdraw
        if (user.acctBalance < amount) {
            return res.status(400).json({
                error: "insufficient balance"
            })
        }

        const withdrawal = await axios.post(
            "https://api.paystack.co/transfer",
            {
                source: "Balance",
                reason: "making use of it",
                amount: amount * 100,
                recipient: ref
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        // get the response
        const response = withdrawal.data.data

        // Update user's account balance
        user.acctBalance -= amount
        await user.save()

        // Return success response
        res.status(200).json({
            message: 'Withdrawal successfully',
            data: response
        })

    } catch (error) {
        console.error('Error fetching bank list:', error.response ? error.response.data : error.message),
            res.status(500).json({
                error: error.message
            })
    }
}