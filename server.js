const express = require("express")
const cors = require("cors")
require("./config/config")
require("dotenv").config()

const userRouter = require("./routers/userRouter")
const walletRouter = require("./routers/walletRouter")
// const paymentRouter = require("./routers/paymentRouter")
// const notificationRouter = require("./routers/notifications")
// const allTransactions = require("./routers/allTransactions")
// const frontStore = require("./routers/productRouter")
// const cartRouter = require("./routers/cartRouter")


const port = process.env.port
const app = express()

app.use(express.json())
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}))

app.use(express.urlencoded({ extended: true }))

// // Routers
app.use(userRouter)
app.use(walletRouter)
// app.use(paymentRouter)
// app.use(notificationRouter)
// app.use(allTransactions)
// app.use(frontStore)
// app.use(cartRouter)


app.get('/', (req, res) => {
  res.send('Streamlining payments and transactions for efficiency and ease.')
})


app.listen(port, () => {
    console.log(`Server is active on port: ${port}`)
})