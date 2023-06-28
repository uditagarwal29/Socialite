const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const customMware = require('./config/middleware')
const app = express();
const PORT = 8000;
const db = require('./config/mongoose');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//used for session cookie and user authorization
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy')
const passportJWT = require('./config/passport-jwt-strategy')
const MongoStore = require('connect-mongo'); //to store session information
const sassMiddleware = require('node-sass-middleware');

//setting up chat sockets server

//creating a chat server and passed app to it
const chatServer = require('http').Server(app);
//passed chatServer to chatSockets function
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
//chatServer is listening to port 5000 where connection was established
chatServer.listen(5000);
console.log('Chat server is listening on PORT : 5000');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());

//extract styles and scripts from sub pages into the layout
app.use(express.static('./assets'));
//making uplaods directory available for browser to access images inside it
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//any request that comes in is redirected to the main route handler index.js in the routes directory
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie ib the db 
app.use(session({
    name: 'socialite',
    //TODO change the secret before deployment
    secret: process.env.SESSION_KEY, //key to encrypt session data
    saveUninitialized: false,  // if the user has not logged in and session is not created we dont want to initialize cookie with extra data
    resave: false, // we dont want to rewrite current session's info
    cookie: { //age of cookie(in milliseconds)
        maxAge: (1000 * 60 * 100)
    },
    //function to permanently store session , even when server is expired or stopped
    //everytime we refresh our server all users are logged out and session cookie resets
    //so we store our session cookie in a persistent storage, i.e mongoDB
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    }, function (err) {
        console.log(err || 'connect-mongodb-setup ok')
    })
}));
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);  //checks if session cookie is present and sets user in locals

//defining flash connect after session defination because we need session cookies for this
app.use(flash());
app.use(customMware.setFlash);


//Use express main router
app.use('/', require('./routes/index'))

app.listen(PORT, function (err) {
    if (err) {
        console.log(`Error : ${err}`); //INTERPOLATION : USING BACKTICKS to include variable in output string
    }
    console.log(`Server is running on PORT : ${PORT}`)
})