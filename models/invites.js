const mongoose=require('mongoose');
const {Schema}=mongoose;

const inviteSchema=new Schema({
    token:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    boardId:{
        type:Schema.Types.ObjectId,
        ref:'board',
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    expiresAt:{
        type:Date,
        required:true
    },
    boardRole:{
        type:String,
        enum:['viewer','editor'],
        default:'viewer'
    },
    invitedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})


const invite=mongoose.model('invite',inviteSchema)


module.exports=invite;