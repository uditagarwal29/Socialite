const express = require("express");
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')
const app = express();
const PORT = 8000;
const db = require('./config/mongoose');

//used for session cookie and user authorization
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy')
const MongoStore = require('connect-mongo'); //to store session information

app.use(express.urlencoded());
app.use(cookieParser());

//extract styles and scripts from sub pages into the layout
app.use(express.static('./assets'));
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//any request that comes in is redirected to the main route handler index.js in the routes directory
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie ib the db 
app.use(session({
    name: 'codial',
    //TODO change the secret before deployment
    secret: 'random', //key to encrypt session data
    saveUninitialized: false,  // if the user has not logged in and session is not created we dont want to initialize cookie with extra data
    resave: false, // we dont want to rewrite current session's info
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    //function to permanently store session , even when server is expired or stopped
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/codeial_development'
    }, function (err) {
        console.log(err || 'connect-mongodb-setup ok')
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);  //checks if session cookie is present and sets user in locals


//Use express main router
app.use('/', require('./routes/index'))

app.listen(PORT, function (err) {
    if (err) {
        console.log(`Error : ${err}`); //INTERPOLATION : USING BACKTICKS to include variable in output string
    }
    console.log(`Server is running on PORT : ${PORT}`)
})