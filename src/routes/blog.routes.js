import express from "express"
import { createBlogs, deleteBlogById, getBlogById, getBlogs, updateBlogById, getMyBlogs } from "../controllers/blog.controller.js"
import { verifyJWT } from '../middlewares/auth.middleware.js'
import multer from 'multer'

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

router.get('/', verifyJWT, getBlogs)
router.get('/myblogs', verifyJWT, getMyBlogs)
router.get('/:blogid', verifyJWT, getBlogById)
router.post('/create', verifyJWT, upload.single('thumbnail'), createBlogs)
router.put('/update/:blogid', verifyJWT, updateBlogById)
router.delete('/delete/:blogid', verifyJWT, deleteBlogById)


export default router

