import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

// configurations for data using app.use()

// for allowing operations/accessing on user's cookies stored in browser.
app.use(cookieParser())

// for cors requests. we can use cors() package or we can use "proxy".
// app.use(cors({origin:process.env.CORS_ORIGIN, credentials:true}))

// const corsOptions = {
//     origin: 'http://localhost:5173',
//     credentials: true, 
// };
// app.use(cors(corsOptions))

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

// to ensure that express understands json & to set limit for incoming json data.
app.use(express.json({ limit: "16kb" }))

// to ensure that express understands all the data coming through url's.
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// for storing static assets,files,images etc. in our server.
app.use(express.static("public"))

// user routes
import userRoutes from './routes/user.routes.js'
app.use('/api/v1/user', userRoutes)

import blogRoutes from './routes/blog.routes.js'
app.use('/api/v1/blogs', blogRoutes)


export default app
