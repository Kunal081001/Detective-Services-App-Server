import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name:String,
    email:String,
    phone:String,
    password:String

});

export const User = mongoose.model("user",UserSchema);