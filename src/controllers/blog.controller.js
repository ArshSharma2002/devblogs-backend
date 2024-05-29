import { ApiError } from '../utility/ApiError.js'
import { ApiResponse } from '../utility/ApiResponse.js'
import { Blog } from '../models/blog.model.js'
import {uploadOnCloudinary} from '../utility/cloudinary.js'

const createBlogs = async (req, res) => {
    try {
        // console.log("Req. File: " + req.file)
        console.log("Req. File Name: " + req.file.filename)
        const { _id } = req.user
        if (!_id) {
            throw new ApiError(400, "User not authenticated !!!")
        }

        console.log("User id: ", _id)

        const { title, description, tag, source } = req.body

        if (!(title && description && tag && source)) {
            throw new ApiError(400, "Blog details are required !!!")
        }

        const thumbnailLocalPath = req.file?.path // both syntax will get the local path of the uploaded file.

        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail is required !!!")
        }

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath) // await coz image/video uploading might tak some time.

        if (!thumbnail) {
            throw new ApiError(400, "Thumbnail not uploaded !!!")
        }

        const newBlog = await Blog.create({
            publisher: _id,
            title,
            description,
            thumbnail: thumbnail.url,
            tag,
            source
        })

        console.log("New blog: ", newBlog)

        return res.status(200).json(new ApiResponse(200, newBlog, "Blog created success !"))


    } catch (error) {
        throw new ApiError(500, 'Error creating blog !!!')
    }
}

const getBlogs = async (req, res) => {
    try {

        // const {_id} = req.user
        // const blogs = await Blog.find({publisher:_id})     
        const blogs = await Blog.find({})

        if (!blogs) {
            throw new ApiError(404, "Blogs not found !!!")
        }

        return res.status(200).json(new ApiResponse(200, blogs, "Blogs fetched success !"))

    } catch (error) {
        throw new ApiError(500, 'Internal Server Error !!!')
    }
}

const getMyBlogs = async (req, res) => {
    try {

        const { _id } = req.user
        const blogs = await Blog.find({ publisher: _id })
        // const blogs = await Blog.find({})     

        if (!blogs) {
            throw new ApiError(404, "Blogs not found !!!")
        }

        return res.status(200).json(new ApiResponse(200, blogs, "Blogs fetched success !"))

    } catch (error) {
        throw new ApiError(500, 'Internal Server Error !!!')
    }
}

const getBlogById = async (req, res) => {
    try {
        const { blogid } = req.params
        if (!blogid) {
            throw new ApiError(400, "Blog id is required !!!")
        }
        const fetchedBlog = await Blog.findById(blogid)
        if (!fetchedBlog) {
            throw new ApiError(404, "Blog not found !!!")
        }
        return res.status(200).json(new ApiResponse(200, fetchedBlog, "Blog fetched success !"))

    } catch (error) {
        throw new ApiError(500, "Internal Server Error !!!")
    }
}

const updateBlogById = async (req, res) => {
    const { title, description } = req.body

    if (!title && !description) {
        throw new ApiError(400, "All fields are required !!!")
    }

    const blog = await Blog.findByIdAndUpdate(
        req.params?.blogid,
        {
            // mongoDB operations
            $set: {
                description: description,
                title: title
            }
        },
        // returns data after updation.
        { new: true }

    )

    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog updated success !"))
}

const deleteBlogById = async (req, res) => {
    try {
        const { blogid } = req.params

        if (!blogid) {
            throw new ApiError(400, "Blog id is required !!!")
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogid)

        if (!deletedBlog) {
            throw new ApiError(400, "Blog not found & deleted !!!")
        }

        return res.status(200).json(new ApiResponse(200, deletedBlog, "Blog deleted success !"))

    } catch (error) {
        throw new ApiError(500, 'Internal Server Error !!!')
    }


}


export { createBlogs, getBlogs, getBlogById, updateBlogById, deleteBlogById, getMyBlogs }