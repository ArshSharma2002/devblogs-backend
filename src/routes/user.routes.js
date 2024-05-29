import express from 'express'
import { isLoggedIn, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', verifyJWT, logoutUser)
router.get('/isloggedin', isLoggedIn)

export default router