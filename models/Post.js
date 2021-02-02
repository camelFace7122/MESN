const mongoose = require('mongoose')
// const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema

const schema = new Schema(
    {
        title: {
            type: String,
        },
        body: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['published', 'draft'],
            required: true,
            default: 'published'
        },
        commentCount: {
            type: Number,
            default: 0    
        },
        url : {
            type: String,
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
)

schema.statics = {
    incCommentCount(postId) {
        return this.findByIdAndUpdate(
            postId,
            {$inc: {commentCount: 1}},
            {new: true}
        )
    } 
}

// schema.pre('save', async function(next) {
//     this.url = slugify(`${this.title}-${Date.now().toString(36)}`, {lowercase: false})
//     next()
// })

// schema.plugin(URLSlugs('title', {
//     field: 'url',
//     generator: (text) => slugify(text, {lowercase: false}),
//     update: true
// }))

module.exports = mongoose.model('Post', schema)