require('dotenv').config()
const express = require('express')
const app = express()
//connect a base de dados
const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
    app.emit('pronto')
})
.catch(e => console.log(e));
// ^^^
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');
const helmet = require('helmet');
const csrf = require('csurf'); // nenhum site postar algo na aplicação
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'texto q ngm vai saber',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //tempo q vai durar o cookie (7dias)
        httpOnly: true
    },
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING})
});

app.use(sessionOptions);
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Nossos próprios middlewares
app.use(csrf())
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('acessar http://localhost:3000')
        console.log('INICIOU NA PORTA 3000')
    })
})
