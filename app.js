const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const staticAsset = require('static-asset')
const config = require('./config')
const mongoose = require('mongoose')
const routes = require('./routes/index')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// database

mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
        require('./mocks')()
    })

mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch(e => {
    console.error('Server Error', e.message)
    process.exit(1)
})

// express
const app = express()

// sessions 
app.use(session({
    secret: config.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// sets and uses
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(staticAsset(path.join(__dirname, 'public')))
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules', 'medium-editor', 'dist', 'js')))

// routers

app.use('/', routes.archive)

app.use('/api/auth', routes.auth)

app.use('/post', routes.post)

app.use('/comment', routes.comment)

app.use('/upload', routes.upload)

// error handlers   

app.use((req, res, next) => {
    const error = new Error('Page not found')
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: !config.IS_PRODUCTION ? err : {},
        title: 'Ooops...'
    })
})

app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})