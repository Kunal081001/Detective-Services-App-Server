import mongoose, { Schema } from "mongoose";

const CaselistSchema = new Schema({
    id:Number,
    yearofcase:String,
    detective:String,
    natureofcase:String,
    description:String

});

export const Case = mongoose.model("caselist",CaselistSchema);