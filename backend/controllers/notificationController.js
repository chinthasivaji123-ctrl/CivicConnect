const mongoose = require("mongoose");

const Notification = require("../models/Notification");



// =================================================
// GET USER NOTIFICATIONS
// =================================================


const getNotifications = async(req,res)=>{


try{


const notifications =
await Notification.find({

    user:req.user.id

})

.populate(

"complaint",

"title status category"

)

.sort({

createdAt:-1

})

.lean();



res.status(200).json({

count:notifications.length,

notifications

});



}

catch(error){


console.log(
"GET NOTIFICATION ERROR:",
error
);



res.status(500).json({

message:
"Unable to fetch notifications"

});


}


};







// =================================================
// MARK SINGLE READ
// =================================================


const markAsRead = async(req,res)=>{


try{


const id=req.params.id;



if(
!mongoose.Types.ObjectId.isValid(id)
){

return res.status(400).json({

message:"Invalid notification id"

});

}




const notification =
await Notification.findById(id);



if(!notification){


return res.status(404).json({

message:"Notification not found"

});


}




if(
notification.user.toString()
!==
req.user.id.toString()

){

return res.status(403).json({

message:"Access denied"

});

}




notification.isRead=true;


await notification.save();




res.status(200).json({

message:
"Notification marked as read"

});



}


catch(error){


console.log(
"READ ERROR:",
error
);



res.status(500).json({

message:
"Unable to update notification"

});


}


};








// =================================================
// MARK ALL READ
// =================================================


const markAllRead = async(req,res)=>{


try{


await Notification.updateMany(

{

user:req.user.id,

isRead:false

},


{

$set:{

isRead:true

}

}

);




res.status(200).json({

message:
"All notifications marked as read"

});



}

catch(error){


console.log(
"MARK ALL ERROR:",
error
);



res.status(500).json({

message:
"Unable to update notifications"

});


}


};










// =================================================
// DELETE NOTIFICATION
// =================================================


const deleteNotification = async(req,res)=>{


try{


const id=req.params.id;



if(
!mongoose.Types.ObjectId.isValid(id)
){

return res.status(400).json({

message:
"Invalid notification id"

});

}




const notification =
await Notification.findById(id);



if(!notification){


return res.status(404).json({

message:
"Notification not found"

});


}




if(

notification.user.toString()
!==
req.user.id.toString()

){


return res.status(403).json({

message:
"Access denied"

});


}




await Notification.findByIdAndDelete(id);




res.status(200).json({

message:
"Notification deleted successfully"

});



}

catch(error){


console.log(
"DELETE NOTIFICATION ERROR:",
error
);



res.status(500).json({

message:
"Unable to delete notification"

});


}


};










// =================================================
// DELETE ALL NOTIFICATIONS
// =================================================


const deleteAllNotifications = async(req,res)=>{


try{


await Notification.deleteMany({

user:req.user.id

});



res.status(200).json({

message:
"All notifications deleted"

});


}

catch(error){


res.status(500).json({

message:
"Unable to delete notifications"

});


}


};









// =================================================
// UNREAD COUNT
// =================================================


const getUnreadCount = async(req,res)=>{


try{


const count =

await Notification.countDocuments({

user:req.user.id,

isRead:false

});




res.status(200).json({

count

});



}

catch(error){


res.status(500).json({

message:
"Unable to get unread count"

});


}


};





module.exports={


getNotifications,

markAsRead,

markAllRead,

deleteNotification,

deleteAllNotifications,

getUnreadCount


};