const express = require('express')
const models = require('./../models/models')
const { slugify } = require('transliteration');
const router = express.Router()

// add GET query

router.get('/edit/:id', async (req, res, next) => {
    const userId = req.session.userId
    const userLogin = req.session.userLogin
    const postId = req.params.id

    if (userId && userLogin) {
        try {
            const post = await models.Post.findById(postId)

            if (!post) {
                const err = new Error('Not Found')
                err.status = 404
                next(err)
            } else {
                res.render('post/edit', {
                    post,   
                    user: {
                        id: userId,
                        login: userLogin
                    }
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    } else {
        res.redirect('/')
    }
})

router.get('/add', async (req, res) => {
    const userId = req.session.userId
    const userLogin = req.session.userLogin

    if (userId && userLogin) {
        const post = await models.Post.findOne({
            owner: userId,
            status: 'draft'
        })

        if (post) {
            res.redirect('/post/edit/' + post._id)
        } else {
            const post = await models.Post.create({
                owner: userId,
                status: 'draft'
            })
            res.redirect('/post/edit/' + post._id)
        }
    } else {
        res.redirect('/')
    }
})

// add POST query

router.post('/add', async(req, res) => {
    console.log(req.body)
    const title = req.body.title.trim().replace(/ +(?= )/g, '')
    const body = req.body.body
    const owner = req.session.userId
    const isDraft = req.body.isDraft
    const postId = req.body.postId
    const url = slugify(`${title}-${Date.now().toString(36)}`, {lowercase: false})

    if (!title || !body) {
        const fields = []
        if (!title) fields.push('title') 
        if (!body) fields.push('body')

        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены',
            fields,
        })
    } else if (title.length < 3  || title.length > 64) {
        res.json({
            ok: false,
            error: 'Заголовок должен состоять из 3 до 64 символов',
            fields: ['title']
        })
    } else if (body.length < 3 || body.length > 300) {
        res.json({
            ok: false,
            error: 'Текст должен иметь от 3 до 1000 символов',
            fields: ['body']
        })
    } else if (!postId) {
        res.json({
            ok: false
        })
    } else {
        try {
            if (postId) {
                const post = await models.Post.findOneAndUpdate({
                    _id: postId,
                    owner
                },
                {
                    title,
                    body,
                    owner,
                    status: isDraft ? 'draft' : 'published',
                    url

                },
                {
                    new: true
                }
                )

                if (!post) {
                    res.json({
                        ok: false,
                        error: 'Чужой пост!'
                    })
                } else {
                    res.json({
                        ok: true,
                        post
                    })
                }
            } else {
                const post = await models.Post.create({
                    title,
                    body,
                    owner,
                    url
                })
    
                res.json({
                    ok: true,
                    post
                })
            }

        } catch (e) {
            res.json({
                ok: false
            })
        }
    }
})

module.exports = router

