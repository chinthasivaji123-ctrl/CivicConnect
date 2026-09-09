const mongoose = require("mongoose");

const Complaint = require("../models/Complaint");

const Notification = require("../models/Notification");




// =====================================================
// CREATE COMPLAINT (CITIZEN)
// =====================================================


const createComplaint = async(req,res)=>{


    try{


        const {

            title,
            description,
            category,

            state,
            district,
            city,
            street,
            pincode


        } = req.body;





        if(

            !title ||
            !description ||
            !category ||

            !state ||
            !district ||
            !city ||
            !street ||
            !pincode

        ){


            return res.status(400).json({

                message:
                "All fields are required"

            });


        }







        const complaint = await Complaint.create({


            title,


            description,


            category,



            address:{


                state,
                district,
                city,
                street,
                pincode


            },



            image:

            req.file

            ?

            req.file.filename

            :

            null,



            user:req.user.id,



            status:"Pending",



            statusHistory:[


                {

                    status:"Pending",

                    date:new Date()

                }


            ]


        });







        // ================================
        // CREATE NOTIFICATION
        // ================================


        await Notification.create({


            user:req.user.id,


            complaint:complaint._id,


            message:

            `Your complaint "${title}" has been submitted successfully`,


            type:"COMPLAINT_CREATED"


        });







        res.status(201).json({


            message:

            "Complaint created successfully",


            complaint


        });





    }


    catch(error){


        console.log(

            "CREATE COMPLAINT ERROR:",

            error

        );



        res.status(500).json({

            message:

            "Complaint creation failed"

        });


    }


};











// =====================================================
// GET MY COMPLAINTS (CITIZEN)
// =====================================================


const getMyComplaints = async(req,res)=>{


    try{


        const complaints = await Complaint.find({


            user:req.user.id


        })


        .populate(

            "user",

            "name email mobile"

        )


        .sort({

            createdAt:-1

        });







        res.status(200).json(

            complaints

        );



    }


    catch(error){


        console.log(

            "GET MY COMPLAINT ERROR:",

            error

        );



        res.status(500).json({

            message:

            "Unable to fetch complaints"

        });


    }


};












// =====================================================
// GET ALL COMPLAINTS (ADMIN)
// =====================================================


const getAllComplaints = async(req,res)=>{


    try{


        const complaints = await Complaint.find()



        .populate(

            "user",

            "name email mobile"

        )



        .sort({

            createdAt:-1

        });







        res.status(200).json(

            complaints

        );



    }


    catch(error){


        console.log(

            "GET ALL COMPLAINT ERROR:",

            error

        );



        res.status(500).json({

            message:

            "Unable to fetch complaints"

        });


    }


};

// =====================================================
// GET SINGLE COMPLAINT
// =====================================================


const getComplaintById = async(req,res)=>{


    try{


        const id = req.params.id;




        if(

            !mongoose.Types.ObjectId.isValid(id)

        ){


            return res.status(400).json({

                message:

                "Invalid complaint id"

            });


        }







        const complaint = await Complaint.findById(id)



        .populate(

            "user",

            "name email mobile"

        );








        if(!complaint){


            return res.status(404).json({

                message:

                "Complaint not found"

            });


        }








        // ===============================
        // CITIZEN SECURITY
        // ===============================


        if(

            req.user.role==="citizen"

            &&

            complaint.user._id.toString()

            !==

            req.user.id.toString()

        ){


            return res.status(403).json({

                message:

                "Access denied"

            });


        }







        res.status(200).json(

            complaint

        );





    }


    catch(error){


        console.log(

            "GET COMPLAINT ERROR:",

            error

        );



        res.status(500).json({

            message:

            "Unable to fetch complaint"

        });


    }


};











// =====================================================
// UPDATE COMPLAINT STATUS (ADMIN)
// =====================================================


const updateComplaintStatus = async(req,res)=>{


    try{


        const {

            status

        } = req.body;





        const allowedStatus = [


            "Pending",

            "In Progress",

            "Resolved"


        ];







        if(

            !allowedStatus.includes(status)

        ){


            return res.status(400).json({

                message:

                "Invalid status"

            });


        }








        const complaint = await Complaint.findById(

            req.params.id

        );







        if(!complaint){


            return res.status(404).json({

                message:

                "Complaint not found"

            });


        }







        const oldStatus = complaint.status;








        // ===============================
        // UPDATE ONLY IF STATUS CHANGED
        // ===============================


        if(oldStatus !== status){



            complaint.status = status;



            complaint.statusHistory.push({


                status,


                date:new Date()


            });





            await complaint.save();







            const notificationMessage =

            `Your complaint "${complaint.title}" status changed from ${oldStatus} to ${status}`;









            // ===============================
            // PREVENT DUPLICATE NOTIFICATION
            // ===============================


            const exists = await Notification.findOne({


                user:complaint.user,


                complaint:complaint._id,


                message:notificationMessage


            });








            if(!exists){


                await Notification.create({


                    user:complaint.user,


                    complaint:complaint._id,


                    message:notificationMessage,


                    type:


                    status==="Resolved"

                    ?

                    "COMPLAINT_RESOLVED"

                    :

                    "STATUS_UPDATE"


                });


            }



        }









        res.status(200).json({


            message:

            "Complaint status updated successfully",


            complaint


        });





    }


    catch(error){


        console.log(

            "UPDATE STATUS ERROR:",

            error

        );



        res.status(500).json({

            message:

            "Unable to update complaint status"

        });


    }


};











// =====================================================
// DELETE COMPLAINT (ADMIN)
// =====================================================


const deleteComplaint = async(req,res)=>{


    try{


        const complaint = await Complaint.findById(

            req.params.id

        );







        if(!complaint){


            return res.status(404).json({

                message:

                "Complaint not found"

            });


        }







        // ===============================
        // CREATE NOTIFICATION BEFORE DELETE
        // ===============================


        await Notification.create({


            user:complaint.user,


            complaint:complaint._id,


            message:

            `Your complaint "${complaint.title}" has been deleted by admin`,


            type:

            "COMPLAINT_DELETED"


        });









        await Complaint.findByIdAndDelete(

            req.params.id

        );









        res.status(200).json({


            message:

            "Complaint deleted successfully"


        });





    }


    catch(error){


        console.log(

            "DELETE COMPLAINT ERROR:",

            error

        );



        res.status(500).json({

            message:

            "Unable to delete complaint"

        });


    }


};

// =====================================================
// ADMIN DASHBOARD STATISTICS
// =====================================================


const getComplaintStats = async(req,res)=>{


    try{


        const total =

        await Complaint.countDocuments();




        const pending =

        await Complaint.countDocuments({

            status:"Pending"

        });




        const inProgress =

        await Complaint.countDocuments({

            status:"In Progress"

        });




        const resolved =

        await Complaint.countDocuments({

            status:"Resolved"

        });









        // ===============================
        // CATEGORY WISE COUNT
        // ===============================


        const categoryStats =

        await Complaint.aggregate([


            {

                $group:{


                    _id:"$category",


                    count:{


                        $sum:1


                    }


                }


            }


        ]);







        const categories = {};





        categoryStats.forEach(item=>{


            categories[item._id] = item.count;


        });








        res.status(200).json({


            total,


            pending,


            inProgress,


            resolved,


            categories


        });





    }


    catch(error){


        console.log(

            "STATS ERROR:",

            error

        );



        res.status(500).json({


            message:

            "Unable to fetch complaint statistics"


        });


    }


};












// =====================================================
// RECENT COMPLAINTS (ADMIN DASHBOARD)
// =====================================================


const getRecentComplaints = async(req,res)=>{


    try{


        const complaints = await Complaint.find()



        .populate(

            "user",

            "name email mobile"

        )



        .sort({

            createdAt:-1

        })



        .limit(5);








        res.status(200).json(

            complaints

        );





    }


    catch(error){


        console.log(

            "RECENT COMPLAINT ERROR:",

            error

        );



        res.status(500).json({


            message:

            "Unable to fetch recent complaints"


        });


    }


};












// =====================================================
// EXPORT CONTROLLERS
// =====================================================


module.exports = {


    createComplaint,


    getMyComplaints,


    getAllComplaints,


    getComplaintById,


    updateComplaintStatus,


    deleteComplaint,


    getComplaintStats,


    getRecentComplaints


};