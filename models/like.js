const mongoose = require("mongoose");
 
const likesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    //defined object id of the liked object
    likeable: {
        //object on which like is made -> post or comment 
        type: mongoose.Schema.ObjectId,
        require: true, 
        refPath: 'onModel'  //reference to another field in database to tell on what obj like has been placed
    },

    //this field is used to define the type of liked object since this is a dynamic reference 
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
}, {
    timestamps: true
})

const Like = mongoose.model("Like", likesSchema);
module.exports = Like;
