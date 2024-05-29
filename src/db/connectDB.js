import mongoose from 'mongoose'

export const connectDB = async () =>{
    try {
        const isConnected = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        if (!isConnected) {
            console.log("Connection failed !!!")
        }
        console.log("DB Connected at host : " , isConnected.connection.host);
    } catch (error) {
        console.error("Error Connecting DB : ", error)
    }
}