import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";     // injected as a plugin

const videoSchema = new Schema({
    videoFile: {
        type: String,        // cloudinary url
        required: true,
    },
    thumbnail: {
        type: String,       // cloudinary url
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,       // cloudinary url
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);      // add your own plugins

export const Video = mongoose.model("Video", videoSchema);