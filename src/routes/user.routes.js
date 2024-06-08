import express from 'express'
import { isLoggedIn, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
const router = express.Router()
import cors from 'cors'
const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'https://blogsfordev.netlify.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));



router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', verifyJWT, logoutUser)
router.get('/isloggedin', isLoggedIn)

export default router