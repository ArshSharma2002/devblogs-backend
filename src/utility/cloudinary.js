import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:  process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async(localFilePath) =>{
    try {
        if (!localFilePath) {
            return null // can also return an error
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })

        // file uploaded success.
        console.log("file uploaded on cloudinary seccessfully : ", response.url)
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // removes locally saved file when upload on cloudinary operation fails.
        return null
        
    }
    
}

export {uploadOnCloudinary}