const userService=require("../services/user.service.js")
const jwtProvider=require("../config/jwtProvider.js")
const bcrypt=require("bcrypt")
const cartService=require("../services/cart.service.js")
const { sanitizeError, errorMessages } = require("../utils/errorHandler.js");


const register=async(req,res)=>{

    try {
        const user=await userService.createUser(req.body);
        const jwt=jwtProvider.generateToken(user._id);

        await cartService.createCart(user);

        return res.status(200).send({jwt,message:"register success"})

    } catch (error) {
        const safeMessage = sanitizeError(error, errorMessages.auth.register);
        return res.status(500).send({message: safeMessage})
    }
}
const login=async(req,res)=>{
    const {password,email}=req.body
    try {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: errorMessages.auth.login });
        }

        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(401).json({ message: errorMessages.auth.login });
        }

        const jwt=jwtProvider.generateToken(user._id);

        return res.status(200).send({jwt,message:"login success"});

    } catch (error) {
        return res.status(500).send({message: errorMessages.auth.login})
    }
}
module.exports={register,login}