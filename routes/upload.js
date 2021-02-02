const express = require('express')
const models = require('./../models/models')
const multer = require('multer')
const path = require('path')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: function(req, file, cb) {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif') {
            const err = new Error('Extension')
            err.code = 'EXTENSION'
            return cb(err)
        }
        cb(null, true)
    }
}).single('file')

router.post('/image', (req, res) => {
    upload(req, res, (err) => {
        let error = ''
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                error = 'Картинка не более 2 МБ'
            }
            if (err.code === 'EXTENSION') {
                error = 'Только форматы jpeg, jpg, png, gif'
            }
        }
        res.json({
            ok: !error,
            error,
        })
    })
})

module.exports = router