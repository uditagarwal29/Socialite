const nodeMailer = require('../config/nodemailer');

exports.resetPasswordMail = (accessToken) => {

    let htmlString=nodeMailer.renderTemplate({accessToken:accessToken},'/Reset_Password/reset_password.ejs');

    nodeMailer.transporter.sendMail({
       from: 'uditagarwal1999@gmail.com',
       to: accessToken.user.email,
       subject: "Reset Password",
       html: htmlString 
    }, (err, info) => { 
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}