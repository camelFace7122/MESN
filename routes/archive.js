const express = require('express')
const models = require('./../models/models')
const config = require('./../config')
const moment = require('moment')

moment.locale('ru');

const router = express.Router()

async function archive(req, res) {

    try {
        const page = req.params.page || 1
        const postsPerPage = +config.POSTS_PER_PAGE

        const posts = await models.Post.find({status: 'published'})
            .skip(page*postsPerPage - postsPerPage)
            .populate('owner')
            .limit(postsPerPage)
            .sort({createdAt: -1})

        const count = await models.Post.estimatedDocumentCount()

        res.render('archive/index', {
            pages: Math.ceil(count/postsPerPage),
            current: page,
            posts,
            user: {
                id: req.session.userId,
                login: req.session.userLogin
            }
        })
    } catch (error) {
        throw new Error('Server Error')
    }
}  

router.get('/', (req, res) => archive(req, res))

router.get('/archive/:page', (req, res) => archive(req, res))

router.get('/posts/:post', async (req, res, next) => {
    try {
        const url = req.params.post.trim().replace(/ +(?= )/g, '')
        const userId = req.session.userId
        const userLogin = req.session.userLogin

        if (!url) {
            const err = new Error('Not Found')
            err.status = 404
            next(err)
        } else {
            const post = await models.Post.findOne({url}).populate('owner')
            if (!post) {
                const err = new Error('Not Found')
                err.status = 404
                next(err)
            } else {

                const comments = await models.Comment.find({post: post.id, parent: {$exists: false}}).populate('children')

                res.render('post/post', {
                    comments,
                    moment,
                    post,
                    user: {
                        id: userId,
                        login: userLogin
                    }
                })
            }
        }
    } catch (error) {
        throw new Error('Server Error')
    }
})

// users posts 

router.get('/users/:login/:page*?', async (req, res) => {
    try {
        const userId = req.session.userId
        const userLogin = req.session.userLogin
        const page = req.params.page || 1
        const login = req.params.login
        const postsPerPage = +config.POSTS_PER_PAGE
    
        const user = await models.User.findOne({login})
        const posts = await models.Post.find({owner: user.id})
                        .skip(page*postsPerPage - postsPerPage)
                        .limit(postsPerPage)
                        .sort({createdAt: -1}) 
                                   
        const count = await models.Post.countDocuments({owner: user._id})
    
        res.render('archive/user', {
            pages: Math.ceil(count/postsPerPage),
            current: page,
            posts,
            _user: user,
            user: {
                id: userId,
                login: userLogin
            }
        })
    } catch (error) {
        throw new Error('Server Error')
    } 
})

module.exports = router
