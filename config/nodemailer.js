const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');

//transporter is the part that sends email defines how communication with email service takes place
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',  //gmail's mailing server domain for us to interact with during sending email
    port: 587,
    secure: false,
    auth: {
        user: 'dummyacc1x1x',
        pass: 'fvfxpqeukhfdwapm'
    }
}
);
//renderTemplate tells that we will be using ejs for mails, and links the html file in views that will be used to display the email
//relativePath = from where the mail is being sent
let renderTemplate = (data, relativePath) => {
    let mailHTML;  // to store HTML that will be used to send email
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath), // relatiePath = place from which this function is being called
        data, //context to fill data
        function (err, template) {
            if (err) { console.log('error in rendering template', err); return }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}