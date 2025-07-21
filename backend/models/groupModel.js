import mongoose from "mongoose";

const confessionIdSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    createdAt : {
        type : Number
    }
})

const groupSchema = new mongoose.Schema({
    groupName : {
        type : String,
        required : true
    },
    groupCode : {
        type : String,
        required : true,
        unique : true
    },
    confessions : {
        type : [confessionIdSchema],
        default : []
    }
    
})

const Group = mongoose.model('Group',groupSchema)

export default Group;