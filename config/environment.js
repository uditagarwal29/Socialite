const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env);
// console.log(process.env.SOCIALITE_GMAIL_PASSWORD)
// console.log(process.env.SOCIALITE_GOOGLE_CLIENT_ID)

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'random',
    db: 'socialite',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com', //gmail's mailing server domain for us to interact with during sending email
        port: 587,
        secure: false,
        auth: {
            user: 'enter-your-gmail-id',
            pass: 'enter-your-password'
        }
    },
    google_client_id: "enter-your-clientid",
    google_client_secret: "enter-your-clientsecret",
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'socialite',

}

const production = {
    name: 'production',
    asset_path: './assets',
    session_cookie_key: 'random',
    db: 'socialite',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'dummyacc1x1x',
            pass: 'enter-your-password'
        }
    },
    google_client_id: "enter-your-clientid",
    google_client_secret: "enter-your-clientsecret",
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'socialite',
}

console.log(production.google_client_id);

module.exports = eval(process.env.NODE_ENV) == undefined ? development : production;
// module.exports =  development ;
