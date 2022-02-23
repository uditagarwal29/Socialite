const express = require("express");
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')
const app = express();
const PORT = 8000;
const db = require('./config/mongoose');

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets')); //loading css
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express Router
//any request that comes in is redirected to the main route handler index.js in the routes directory
app.use('/', require('./routes/index'))
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(PORT, function (err) {
    if (err) {
        console.log(`Error : ${err}`); //INTERPOLATION : USING BACKTICKS to include variable in output string
    }
    console.log(`Server is running on PORT : ${PORT}`)
})