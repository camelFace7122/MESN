const express = require('express')
const models = require('./../models/models')

const router = express.Router()

router.post('/add', async (req, res) => {
    const userId = req.session.userId
    const userLogin = req.session.userLogin

    if (!userId || !userLogin) {
        res.json({
            ok: false
        })
    } else {
        const body = req.body.body
        const parent = req.body.parent
        const post = req.body.post

        if (!body) {
            res.json({
                ok: false,
                error: 'Пустой комментарий'
            })
        }

        try {
            if (!parent) {
                models.Comment.create({
                    post,
                    body,
                    owner: userId,
                })
                res.json({
                    ok: true,
                    login: userLogin,
                    body,
                    
                })
            } else {
                const parentComment = await models.Comment.findById(parent)
                if (!parentComment) {
                    res.json({
                        ok: false
                    })
                }
                const comment = await models.Comment.create({
                    post,
                    body,
                    owner: userId,
                    parent
                })

                const children = parentComment.children
                children.push(comment.id)
                parentComment.children = children
                await parentComment.save()

                res.json({
                    ok: true,
                    login: userLogin,
                    body
                })
            }
        } catch(error) {
            res.json({
                ok: false
            })
        }
    }
})

module.exports = router