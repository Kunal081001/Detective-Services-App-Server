import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({
    name:String,
    email:String,
    phone:String,
    username:String,
    password:String

});

export const Admin = mongoose.model("admin",AdminSchema);