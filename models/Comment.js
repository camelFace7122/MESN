const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Post = require('./Post')

const schema = new Schema(
    {
        body: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        children: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
                autopopulate: true
            }
        ],
    },
    {
        timestamps: false,
    }
)

schema.pre('save', async function(next) {
    if (this.isNew) {
        await Post.incCommentCount(this.post)
    }
    next()
})

schema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('Comment', schema)