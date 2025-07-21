import express from 'express'
import User from '../models/userModel.js'
import Group from '../models/groupModel.js'
import Confession from '../models/confessionModel.js'
import AdminReport from '../models/adminReportModel.js'

const HandleSignUp = async(req,res) => {
    try {
        const {username,password} = req.body
        const user = await User.findOne({userName : username})
        if(username == "admin1234" || user){
            return res.status(409).json({message : 'username already exists'})
        }
        const newUser = new User({
            userName : username,
            password : password,
            joinedGroups : [],
            createdGroups : [],
            isbanned : false
        })
        await newUser.save()
        return res.status(200).json({
            message : "login success",
            createdgroups : newUser.createdGroups,
            joinedgroups : newUser.joinedGroups
        })
    } catch (error) {
        console.error('SignUp error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const HandleLogin = async (req,res) => {
    try {
        const {username,password} = req.body
        if(username == "admin1234" && password== "@dmin"){
            const reports = await AdminReport.find()
            if(reports){
                return res.status(200).json({
                    message : "admin",
                    isAdmin : true,
                    reports : reports
                })
            }
        }
        const user = await User.findOne({userName : username})
        if(!user || user.password!=password || user.isbanned){
            if(user.isbanned){
                return res.status(401).json({message : "You are banned by the Admin"})
            }
            return res.status(401).json({message : "Invalid username or password"})
        }
        return res.status(200).json({
            message : "login success",
            isAdmin : false,
            createdgroups : user.createdGroups,
            joinedgroups : user.joinedGroups
        })
    } catch (error) {
        console.log('login error',error)
        return res.status(500).json({message: 'server error'})
    }
}

const HandleJoingroup = async (req,res) => {
    try {
        const {username,groupcode} = req.body
        const group = await Group.findOne({groupCode : groupcode})
        const user = await User.findOne({userName : username})
        if(group && user){
            user.joinedGroups.push({
                groupcode : groupcode,
                groupname : group.groupName,
                last_visited : 0
            })
            await user.save()
            return res.status(200).json({
                message : "group found",
                joinedGroups : user.joinedGroups
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'server error'})
    }
}

const HandleCreateGroup = async (req,res) => {
    try {
        const {username,groupname,groupcode} = req.body
        const group = await Group.findOne({groupCode : groupcode})
        const user = await User.findOne({userName : username})
        if(group){
            return res.status(401).json({message : "Please provide a different group code, the given code already exists"})
        }
        if(!user){
            return res.status(401).json({message : 'could not find the user'})
        }
        user.createdGroups.push({
            groupcode : groupcode,
            groupname : groupname,
            last_visited : Date.now()
        })
        await user.save()
        const newGroup = new Group({
            groupName : groupname,
            groupCode : groupcode,
            confessions : []
        })
        newGroup.save()
        return res.status(200).json({
            message : "group created successfully",
            createdGroups : user.createdGroups
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'server error'})
    }
}

const handleGroup = async(req,res) => {
    try {
        const {groupcode} = req.body
        const group = await Group.findOne({groupCode : groupcode})
        const returnConfessions =[]
        if(group){
            for(const confession of group.confessions){
                const fetchConfession = await Confession.findById(confession.id) 
                if(fetchConfession){
                    returnConfessions.push({
                        confessionId : confession.id ,
                        text : fetchConfession.text,
                        createdAt : fetchConfession.createdAt
                    })
                }
            }
            return res.status(200).json({confessions : returnConfessions})
        }
        else{
            console.log('error in finding group')
        }
    } catch (error) {
        console.log('error in finding confessions from group')
        return res.status(500).json({message : 'server error'})
    }
}

const HandleConfession = async(req,res) => {
    try {
        const {username,groupcode,post} = req.body
        const group = await Group.findOne({groupCode : groupcode})
        if(group){
            const newConfession = new Confession({
                creatorUsername : username,
                text : post,
                createdAt : Date.now()
            })
            const savedConfession = await newConfession.save()
            group.confessions.push({
                id : savedConfession._id,
                createdAt : newConfession.createdAt
            })
            await group.save()
        }
    } catch (error) {
        console.log("error in saving the post",error)
        return res.status(500).json({message : "server error"})
    }
}

const HandleUnreadMessages = async(req,res) => {
    try {
        const {timestamp,groupcode} = req.body
        const group = await Group.findOne({groupCode : groupcode})
        if(group){
            let count = 0;
            for(const confession of group.confessions){
                if(confession.createdAt >= timestamp){
                    count++;
                }
            }
            return res.status(200).json({unreadCount : count})
        }
        else{
            return res.status(404).json({message : "Group not found"})
        }
    } catch (error) {
        console.log('error in finding unread messages')
        return res.status(500).json({message: 'server error'})
    }
}

const HandleReport = async(req,res) => {
    try {
        const {confessionId,groupcode,report} = req.body
        const confession = await Confession.findById(confessionId)
        if(confession){
            const newReport = new AdminReport({
                confessionId : confessionId,
                username : confession.creatorUsername,
                groupcode : groupcode,
                text : confession.text,
                report : report
            })
            await newReport.save()
            return res.status(200).json({message: "report sended successfully"})
        }
    } catch (error) {
        return res.status(500).json({message : "error in sending report"})
    }
}

const HandlebackToGroups = async(req,res) => {
    try {
        const {username,groupcode} = req.body
        const user = await User.findOne({userName : username})
        if(!user){
            return res.status(404).json({message : "user not found"})
        }
        let updated = false;
        for (const groupList of [user.createdGroups, user.joinedGroups]) {
        for (const group of groupList) {
            if (group.groupcode === groupcode) {
            group.last_visited = Date.now();
            updated = true;
            break;
            }
        }
        if (updated) break;
        }
        if (updated) {
            await user.save();
            return res.status(200).json({
                createdGroups: user.createdGroups,
                joinedGroups: user.joinedGroups,
            });
        } else {
        return res.status(404).json({ message: "Group not found" });
        }
    } catch (error) {
        return res.status(500).json({message : "error in updating timestamp"})
    }
}

const HandleDelete = async (req, res) => {
  try {
    const { confessionId, groupcode } = req.body;
    const confession = await Confession.findById(confessionId);
    const group = await Group.findOne({ groupCode: groupcode });
    if (group && confession) {
      group.confessions = group.confessions.filter(
        (id) => id.toString() !== confessionId
      );
      await Confession.findByIdAndDelete(confessionId);
      await group.save();
      return res.status(200).json({ message: "confession deleted" });
    } else {
      return res.status(404).json({ message: "confession or group not found" });
    }
  } catch (error) {
    console.error("Error deleting confession:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const HandleDeleteAndBan = async (req, res) => {
  try {
    const { confessionId,username,groupcode } = req.body;
    const confession = await Confession.findById(confessionId);
    const group = await Group.findOne({ groupCode: groupcode });
    const user = await User.findOne({userName : username})
    const report = await AdminReport.findOne({confessionId : confessionId})
    if (group && confession && user && report) {
        await AdminReport.deleteOne({ confessionId: confessionId });
        user.isbanned = true;
        await user.save()
      group.confessions = group.confessions.filter(
        (id) => id.toString() !== confessionId
      );
      await Confession.findByIdAndDelete(confessionId);
      await group.save();
      return res.status(200).json({ message: "confession deleted" });
    } else {
      return res.status(404).json({ message: "confession or group or user not found" });
    }
  } catch (error) {
    console.error("Error deleting confession:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export {HandleSignUp,HandleLogin,HandleJoingroup,HandleCreateGroup,handleGroup,HandleConfession,HandleUnreadMessages,HandleReport,HandlebackToGroups,HandleDelete,HandleDeleteAndBan}