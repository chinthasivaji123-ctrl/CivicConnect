const mongoose = require("mongoose");


// ======================================================
// COMPLAINT SCHEMA
// ======================================================


const complaintSchema = new mongoose.Schema(


    {


        // ==================================================
        // COMPLAINT DETAILS
        // ==================================================


        title: {

            type:String,

            required:true,

            trim:true

        },



        description: {

            type:String,

            required:true,

            trim:true

        },



        category: {

            type:String,

            required:true,

            trim:true

        },





        // ==================================================
        // COMPLAINT IMAGE
        // ==================================================


        image: {

            type:String,

            default:null

        },







        // ==================================================
        // COMPLETE COMPLAINT ADDRESS
        // ==================================================


        address:{


            state:{

                type:String,

                required:true,

                trim:true

            },



            district:{

                type:String,

                required:true,

                trim:true

            },



            city:{

                type:String,

                required:true,

                trim:true

            },



            street:{

                type:String,

                required:true,

                trim:true

            },



            pincode:{

                type:String,

                required:true,

                trim:true,

                match:/^[0-9]{6}$/

            }


        },









        // ==================================================
        // COMPLAINT STATUS
        // ==================================================


        status:{


            type:String,


            enum:[

                "Pending",

                "In Progress",

                "Resolved"

            ],


            default:"Pending"


        },









        // ==================================================
        // COMPLAINT PRIORITY
        // ==================================================


        priority:{


            type:String,


            enum:[

                "Low",

                "Medium",

                "High"

            ],


            default:"Medium"


        },









        // ==================================================
        // STATUS TIMELINE
        // ==================================================


        statusHistory:[


            {


                status:{


                    type:String,


                    enum:[

                        "Pending",

                        "In Progress",

                        "Resolved"

                    ],


                    required:true


                },



                date:{


                    type:Date,


                    default:Date.now


                }



            }


        ],











        // ==================================================
        // CITIZEN WHO CREATED THE COMPLAINT
        // ==================================================


        user:{


            type:mongoose.Schema.Types.ObjectId,


            ref:"User",


            required:true


        }



    },





    // ======================================================
    // AUTOMATIC CREATED / UPDATED DATE
    // ======================================================


    {


        timestamps:true


    }



);








// ======================================================
// EXPORT MODEL
// ======================================================


module.exports = mongoose.model(

    "Complaint",

    complaintSchema

);