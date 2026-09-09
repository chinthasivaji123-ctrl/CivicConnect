const express=require("express");

const router=express.Router();



const authMiddleware =
require("../middleware/authMiddleware");



const {


getNotifications,

markAsRead,

markAllRead,

deleteNotification,

deleteAllNotifications,

getUnreadCount


}=require("../controllers/notificationController");






// GET ALL NOTIFICATIONS

router.get(

"/",

authMiddleware,

getNotifications

);







// GET UNREAD COUNT

router.get(

"/unread-count",

authMiddleware,

getUnreadCount

);







// MARK ONE READ

router.put(

"/read/:id",

authMiddleware,

markAsRead

);







// MARK ALL READ

router.put(

"/read-all",

authMiddleware,

markAllRead

);








// DELETE ALL

router.delete(

"/delete-all",

authMiddleware,

deleteAllNotifications

);








// DELETE SINGLE

router.delete(

"/:id",

authMiddleware,

deleteNotification

);





module.exports=router;