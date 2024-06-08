import app from './src/app.js'
import dotenv from 'dotenv'
import { connectDB } from './src/db/connectDB.js'
import cors from 'cors'

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


dotenv.config()

try {
    connectDB().then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`listening on port ${process.env.PORT}`)
        })
    
    }).catch((err) => {
        console.log("Error connecting DB !!!", err);
        process.exit()
    })

} catch (error) {
    console.log(error);
}
