import { User } from '../models/user.model.js'
import { ApiError } from '../utility/ApiError.js'
import { ApiResponse } from '../utility/ApiResponse.js'
import bcrypt from 'bcrypt'

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()

        // storing refreshToken of user in the database
        user.refreshtoken = refreshtoken
        await user.save({ validateBeforeSave: false })

        return { accesstoken, refreshtoken }

    } catch (error) {
        console.log("Error: ", error)
        throw new ApiError(500, "Something went wrong generating tokens !!!")
    }
}

const registerUser = async (req, res) => {
    try {

        const { username, fullname, email, password } = req.body
        let isAdmin = false;

        if(username.includes("admin@")){
            isAdmin=true
        }

        if (!(username && email && password && fullname)) {
            throw new ApiError(400, "Email & User name is required !!!")
        }

        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }]
        })

        console.log("Existing User: ", existingUser)

        if (existingUser) {
            throw new ApiError(400, "User already exists !!!")
        }

        const newUser = await User.create({
            username,
            fullname,
            email,
            password,
            isAdmin
        })

        console.log("user created !");

        const createdUser = await User.findById(newUser._id).select("-password -refreshtoken")

        console.log("created user: ", createdUser)

        if (!createdUser) {
            throw new ApiError(404, "User not found !!!")
        }

        return res.status(200).json(new ApiResponse(200, createdUser, "User registration Success !"))

    } catch (error) {
        console.error(error)
        throw new ApiError(500, "Internal Server Error !!!")
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!(username && email && password)) {
            throw new ApiError(400, "User credentials required !!!")
        }

        const verifyUser = await User.find({
            $or: [{ username: username }, { email: email }]
        })

        if (!verifyUser) {
            throw new ApiError(400, "Wrong Credentials !!!")
        }

        // console.log(verifyUser)

        const checkPassword = await bcrypt.compare(password, verifyUser[0].password)

        // console.log("checked password: ", checkPassword)

        if (!checkPassword) {
            throw new ApiError(400, "Wrong Password !!!")
        }

        const { accesstoken, refreshtoken } = await generateTokens(verifyUser[0]._id)

        const loggedInUser = await User.findById(verifyUser[0]._id).select("-password -refreshtoken")

        // options for cookies for security so, that only server can modify these cookies.
        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("accesstoken", accesstoken, options).cookie("refreshtoken", refreshtoken, options).json(
            new ApiResponse(200, {
                user: loggedInUser,
                accesstoken,
                refreshtoken
            },
                "User logged in Successfully")
        )


    } catch (error) {
        console.error(error)
        throw new ApiError(500, "Internal Server Error !!!")
    }
}

const logoutUser = async (req, res) => {
    try {

        console.log("logging out user...")
        await User.findByIdAndUpdate(req.user._id,
            {
                $set: { refreshtoken: undefined }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accesstoken", options)
            .clearCookie("refreshtoken", options)
            .json(new ApiResponse(200, {}, "User logged out Successfully !!!"))

    } catch (error) {
        throw new ApiError(500, "Error logging out !!!")
    }
}

const isLoggedIn = async(req, res) =>{
    try {
        console.log("checking user login status...")
        var loginstatus = true
        if(!req.cookies.accesstoken){
            loginstatus = false
            console.log("user is logged out !")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {loginstatus:loginstatus}, "User status sent !"))
        
    } catch (error) {
        throw new ApiError(500, 'Internal Server Error !!!')
        
    }
}

export {registerUser, loginUser, logoutUser, isLoggedIn}