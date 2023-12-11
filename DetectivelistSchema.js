import mongoose, { Schema } from "mongoose";

const DetectiveSchema = new Schema({
    id:Number,
    name:String,
    previouscase:String,
    background:String,
    specialization:String

});

export const Detective = mongoose.model("detective",DetectiveSchema);