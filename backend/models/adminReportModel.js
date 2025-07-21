import mongoose from "mongoose";

const adminReportSchema = new mongoose.Schema({
    confessionId : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    groupcode : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    report : {
        type : String,
        required : true
    }
}) 

const AdminReport = mongoose.model('AdminReport',adminReportSchema)
export default AdminReport