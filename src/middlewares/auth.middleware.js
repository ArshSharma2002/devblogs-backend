import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

const verifyJWT = async(req, res, next)=>{
    try {
        
        // console.log("inside middleware...")
        const token = req.cookies.accesstoken
        // console.log("Token Val : " + token)
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request !!!")
        }

        // console.log("got token .....")
    
        const decodedInfo = jwt.verify(token, process.env.ACCESSTOKEN_SECRET)

        // console.log("User Verified: ", decodedInfo)
    
        const user = await User.findById(decodedInfo?._id).select("-password -refreshtoken")

        // console.log("Res user: ", user)
    
        if (!user) {
            throw new ApiError(401, "Invalid access token !!!")
        }
    
        req.user = user
        // console.log("Req user: ", req.user)
        next()

    } catch (error) {
        throw new ApiError(401,"Auth Middleware error !!!")
    }
}

export {verifyJWT}