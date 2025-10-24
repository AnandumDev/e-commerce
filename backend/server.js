import express from 'express'
import userRouter from './router/userRouter.js'
import 'dotenv/config'
import connectDB from './config/db.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin: ['https://e-commerce-zeta-topaz-55.vercel.app'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static("uploads"));

app.use('/api/auth', userRouter)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    connectDB()
})
