const mongoose = require("mongoose");


// ======================================================
// SMARTTOWN NOTIFICATION MODEL
// ======================================================


const notificationSchema = new mongoose.Schema(

{

    // Receiver User

    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true,

        index:true

    },



    // Related Complaint

    complaint:{


        type:mongoose.Schema.Types.ObjectId,

        ref:"Complaint",

        required:true

    },



    // Notification Message


    message:{


        type:String,

        required:true,

        trim:true,

        maxlength:200


    },



    // Notification Type


    type:{


        type:String,


        enum:[

            "STATUS_UPDATE",

            "COMPLAINT_CREATED",

            "COMPLAINT_RESOLVED",

            "COMPLAINT_DELETED",

            "GENERAL"

        ],


        default:"STATUS_UPDATE"


    },




    // Read Status


    isRead:{


        type:Boolean,


        default:false,


        index:true


    }



},



{


    timestamps:true


}

);





// ======================================================
// INDEXES
// ======================================================


// Latest notifications

notificationSchema.index({

    user:1,

    createdAt:-1

});



// unread count

notificationSchema.index({

    user:1,

    isRead:1

});



// Prevent duplicate notifications

notificationSchema.index(

{

    user:1,

    complaint:1,

    message:1

},

{

    unique:true

}

);





module.exports =
mongoose.model(

    "Notification",

    notificationSchema

);