const User = require('../../../models/user')
const jwt = require('jsonwebtoken');


module.exports.createSession = async function (req, res) {
    try {
        //find user from sign in form data
        let user = await User.findOne({ email: req.body.email });

        // if user nto found or password incorrect
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: "Invalid username/password"
            });
        }
        // if user found create JWT token using encrypting key : "codeial"
        return res.json(200, {
            message: "Sign in successfull",
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', { expiresIn: '100000' })
            }
        })

    } catch (err) {
        console.log('Error : ', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }

}  