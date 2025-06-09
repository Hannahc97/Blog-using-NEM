import mongoose from "mongoose";

// async because we are going to use await inside it (which helps us deal with things that take time, like connecting to a database).
export const connectDB = async () =>{
    try{
        mongoose.set("strictQuery", false) // It tells it not to complain if we make queries with fields that aren’t in the schema. It’s kind of a warning-suppressor.
        const conn = await mongoose.connect(process.env.MONGODB_URL); // await means: wait until Mongoose finishes connecting before continuing
        console.log(`Database Connected: ${conn.connection.host}`)
    }
    catch (error){
        console.log(error)
    }
}