import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
videoFile: {
    type: String,//cloudinary url
    required: true
},
thumbnail: {
    type: String,//cloudinary url
    required: true
},
title: {
    type: String,//cloudinary url
    required: true
},
description: {
    type: String,//cloudinary url
    required: true
},
duration: {
    type: Number,
    required: true
},
views: {
    type: Number,
    required: true
},
isPublished: {
    type: Boolean,
    required: true
},
owner: {
    type: Schema.Types.ObjectId,
    ref: "user"
}
},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)


export const video = mongoose.model("video",videoSchema);