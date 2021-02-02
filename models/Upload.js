const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        path: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
)

module.exports = mongoose.model('Upload', schema)