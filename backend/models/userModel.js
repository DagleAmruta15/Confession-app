import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    joinedGroups : [
        {
            groupcode : {type : String, required : true},
            groupname : {type : String, required : true},
            last_visited : {type : Number, required : true}
        }
    ],
    createdGroups : [
        {
            groupcode : {type : String, required : true},
            groupname : {type : String, required : true},
            last_visited : {type : Number, required : true}
        }
    ],
    isbanned : {
        type : Boolean,
        default : false
    }
});

const User = mongoose.model('User',userSchema)

export default User;