import express from "express"
import { createBlogs, deleteBlogById, getBlogById, getBlogs, updateBlogById, getMyBlogs } from "../controllers/blog.controller.js"
import { verifyJWT } from '../middlewares/auth.middleware.js'
import multer from 'multer'
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



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        return cb(null, uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

const router = express.Router()

const allowCorsForRoute2 = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://blogsfordev.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};


router.get('/',allowCorsForRoute2, verifyJWT, getBlogs)
router.get('/myblogs',allowCorsForRoute2, verifyJWT, getMyBlogs)
router.get('/:blogid',allowCorsForRoute2, verifyJWT, getBlogById)
router.post('/create',allowCorsForRoute2, verifyJWT, upload.single('thumbnail'), createBlogs)
router.put('/update/:blogid',allowCorsForRoute2, verifyJWT, updateBlogById)
router.delete('/delete/:blogid',allowCorsForRoute2, verifyJWT, deleteBlogById)


export default router

