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
    const {password,email, googleAuth}=req.body
    try {
        let user = await userService.getUserByEmail(email);

        // ✅ Handle Google Authentication for Admin
        if (googleAuth) {
            // Restrict to specific admin email
            const ALLOWED_ADMIN_EMAIL = 'fluteoncompany@gmail.com';
            if (email !== ALLOWED_ADMIN_EMAIL) {
                return res.status(403).json({ 
                    message: `Access Denied: Only ${ALLOWED_ADMIN_EMAIL} is authorized for admin access` 
                });
            }

            // Create user if doesn't exist (first-time Google login)
            if (!user) {
                const { firstName, lastName } = req.body;
                user = await userService.createUser({
                    email,
                    password: password, // Using Firebase UID as password
                    firstName: firstName || 'Admin',
                    lastName: lastName || '',
                    role: 'ADMIN' // Set admin role
                });
            }

            // Generate JWT and return
            const jwt = jwtProvider.generateToken(user._id);
            return res.status(200).send({ jwt, message: "Admin login success", user });
        }

        // ✅ Regular email/password login
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