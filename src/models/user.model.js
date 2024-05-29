import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema  = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    refreshtoken:{
        type: String
    },
    isAdmin:{
        type: Boolean,
        default: false
    }

}, {timestamps: true})


userSchema.pre("save", async function(next){
    if (this.isModified("password")) {           
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullname: this.fullname,
        email: this.email
    }, 
    process.env.ACCESSTOKEN_SECRET,
    {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESHTOKEN_SECRET,
    {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY
    })
}


export const User = mongoose.model("User", userSchema)