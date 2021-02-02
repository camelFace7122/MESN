const express = require('express')
const models = require('./../models/models')
const bcrypt = require('bcrypt');

const router = express.Router()

// register POST query

router.post('/register', async (req, res) => {

    try {
        const login = req.body.login
        const password = req.body.password
        const passwordConfirm = req.body.passwordConfirm

        if (!login || !password || !passwordConfirm) {
            const fields = []
            if (!login) fields.push('login')
            if (!password) fields.push('password')
            if (!passwordConfirm) fields.push('passwordConfirm')
    
            res.json({
                ok: false,
                error: 'Все поля должны быть заполнены!',
                fields
            })
        } else if (login.length < 3 || login.length > 16) {
            res.json({
                ok: false,
                error: 'Длина логина от 3 до 16 символов',
                fields: ['login']
            })
        } else if (!/^[a-zA-Z1-9]+$/.test(login)) {
            res.json({
                ok: false,
                error: 'Только латинские буквы и цифры!',
                fields: ['login']
            })
        } else if (password !== passwordConfirm) {
            res.json({
                ok: false,
                error: 'Пароли не совпадают',
                fields: ['password', 'passwordConfirm']
            })
        } else {

            const user = await models.User.findOne({login})

            if (!user) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hash = await bcrypt.hash(password, salt)
                    const user = await models.User.create({
                        login,
                        password: hash,
                    })
                    req.session.userId = user.id
                    req.session.userLogin = user.login
                    res.json({
                        ok: true
                    })
                } catch(e) {
                    res.json({
                        ok: false,
                        error: 'Попробуйте позже'
                    })
                }
            } else {
                res.json({
                    ok: false,
                    error: 'Пользователь с таким именем уже существует',
                    fields: ['login']
                })
            }
        }
    } catch (error) {
        throw new Error('Server Error')
    }
})

// login POST query

router.post('/login', async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password

        if (!login || !password) {
            const fields = []
            if (!login) fields.push('login')
            if (!password) fields.push('password')

            res.json({
                ok: false,
                error: 'Все поля должны быть заполнены!',
                fields
            })
        } else {
            const user = await models.User.findOne({ login })

            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        req.session.userId = user.id
                        req.session.userLogin = user.login

                        res.json({
                            ok: true
                        })
                    } else {
                        res.json({
                            ok: false,
                            error: 'Неверный логин или пароль',
                            fields: ['login', 'password']
                        })
                    }
                });
            } else {
                res.json({
                    ok: false,
                    error: 'Неверный логин или пароль',
                    fields: ['login', 'password']
                })
            }
        }
    } catch (error) {
        throw new Error('Server Error')
    }
})

// logout GET query

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/')
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router