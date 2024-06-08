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

const allowCorsForRoute2 = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://blogsfordev.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};


router.post('/register',allowCorsForRoute2, registerUser)
router.post('/login',allowCorsForRoute2, loginUser)
router.post('/logout',allowCorsForRoute2, verifyJWT, logoutUser)
router.get('/isloggedin',allowCorsForRoute2, isLoggedIn)

export default router