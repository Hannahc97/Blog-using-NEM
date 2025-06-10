import mongoose from "mongoose";

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// ✅ Export only the model
export const User = mongoose.model('User', UserSchema);

//  this schema to creates a model and that model saves new users to the database.