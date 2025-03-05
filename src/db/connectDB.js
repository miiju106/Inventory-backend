const mongoose = require("mongoose")

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        // console.log(`mongodb connect: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connecting to mongoDB", error)
    }
}

module.exports={connectDB}