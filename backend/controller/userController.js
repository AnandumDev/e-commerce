import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const Register = async (req, res) => {
    try {
        const { fullName, email , password } = req.body 

        if(!fullName || !email || !password ) {
            return res.status(400).json({message: "All fields are required"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
              return res.status(400).json({message: "Invalid Email format"})
        }

        const existingEmail = await User.findOne({email})
        if(existingEmail) {
            return res.status(400).json({message: "Email already exist"})
        }

        if(password.length < 6){
              return res.status(400).json({message: "Password should be atleast 6 charachters"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(200).json({message: "Register successfull", user: {
            fullName: newUser.fullName,
            email: newUser.email,
            id: newUser._id
        }})
    } catch (error) {
        console.log('Error in register controller', error.message);
        res.status(500).json({message: "Internal server error", error})
    }
}


export const Login = async (req, res) => {
    try {
        const {email , password} = req.body

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
              return res.status(400).json({message: "Invalid Email format"})
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "User not found"})
        }


        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid credential"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: '7d'
        })

        res.status(200).json({message: "Login successfull", user: {
            email: user.email,
            fullName: user.fullName,
            id: user._id
        },token})

    } catch (error) {
        console.log('Error in Login controller', error.message);
        res.status(500).json({message: "Internal server error", error})
    }
}



