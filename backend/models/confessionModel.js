import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema({
    creatorUsername : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    createdAt : {
        type : Number,
        required : true
    }
})

const Confession = mongoose.model('Confession',confessionSchema)
export default Confession;