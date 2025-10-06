const mongoose = require('mongoose');
const {Schema} = mongoose;

const boardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required:false
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    collaborators:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    content: { type: Array, default: [] },
    
}, { timestamps: true });





const board = mongoose.model('board', boardSchema);



module.exports = board;
