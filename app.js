const express = require('express')
const path = require('path')
const router = require('./router/router.js')
const admin_router = require('./router/admin_router.js')
const line_router = require('./router/line_router')

const app = express()

const session = require('express-session');
const MongoStore = require('connect-mongo');
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
app.use(session({
    secret: 'A3KD60Qw34EAFM4',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: 'SESSION',
        ttl:60*60*10
    })
}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'hbs')

app.use('/linewebhook',line_router)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



app.use('/', router)
app.use('/admin', admin_router)


//////////////////////////////////////////////////////////////////
const autoSetDate = require('./controller/autodate.js')
autoSetDate.start()
//autoSetDate.resetdate()

const PORT = 3300 || process.env.PORT
const HOST = '0.0.0.0'
app.listen(PORT, HOST, () => {
    console.log(`server is running on ${HOST}:${PORT}`)
})