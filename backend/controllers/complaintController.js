const mongoose = require("mongoose");

const Complaint = require("../models/Complaint");

const Notification = require("../models/Notification");

const cloudinary = require("../config/cloudinary");


// =====================================================
// UPLOAD IMAGE TO CLOUDINARY
// =====================================================

const uploadToCloudinary = (buffer) => {

    return new Promise((resolve, reject) => {

        const uploadStream =
            cloudinary.uploader.upload_stream(

                {
                    folder: "civicconnect/complaints",
                    resource_type: "image"
                },

                (error, result) => {

                    if (error) {

                        reject(error);

                    }
                    else {

                        resolve(result);

                    }

                }

            );


        uploadStream.end(buffer);

    });

};


// =====================================================
// CREATE COMPLAINT (CITIZEN)
// =====================================================

const createComplaint = async (req, res) => {

    try {

        console.log("");
        console.log("========================================");
        console.log("CREATE COMPLAINT REQUEST");
        console.log("========================================");

        console.log("BODY:", req.body);

        console.log(
            "FILE:",
            req.file
                ? {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                }
                : "NO FILE"
        );

        console.log(
            "USER:",
            req.user
        );


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


        // =================================================
        // VALIDATE REQUIRED FIELDS
        // =================================================

        if (

            !title ||
            !description ||
            !category ||
            !state ||
            !district ||
            !city ||
            !street ||
            !pincode

        ) {

            console.log(
                "VALIDATION FAILED"
            );


            return res.status(400).json({

                message:
                    "All fields are required"

            });

        }


        // =================================================
        // UPLOAD IMAGE
        // =================================================

        let imageUrl = null;


        if (req.file) {

            console.log(
                "IMAGE FOUND"
            );

            console.log(
                "Starting Cloudinary upload..."
            );


            try {

                const uploadedImage =
                    await uploadToCloudinary(
                        req.file.buffer
                    );


                console.log(
                    "CLOUDINARY UPLOAD SUCCESS"
                );


                console.log(
                    "Cloudinary result:",
                    uploadedImage
                );


                imageUrl =
                    uploadedImage.secure_url;


                console.log(
                    "IMAGE URL:",
                    imageUrl
                );

            }


            catch (uploadError) {

                console.log("");
                console.log(
                    "========================================"
                );
                console.log(
                    "CLOUDINARY UPLOAD ERROR"
                );
                console.log(
                    "========================================"
                );

                console.log(
                    uploadError
                );

                console.log(
                    "ERROR MESSAGE:",
                    uploadError.message
                );

                console.log(
                    "ERROR NAME:",
                    uploadError.name
                );

                console.log(
                    "ERROR HTTP CODE:",
                    uploadError.http_code
                );


                return res.status(500).json({

                    message:
                        "Image upload failed",

                    error:
                        uploadError.message || "Unknown Cloudinary error"

                });

            }

        }
        else {

            console.log(
                "NO IMAGE PROVIDED"
            );

        }


        // =================================================
        // CREATE COMPLAINT
        // =================================================

        console.log(
            "Creating complaint in MongoDB..."
        );


        const complaint =
            await Complaint.create({

                title,

                description,

                category,

                address: {

                    state,
                    district,
                    city,
                    street,
                    pincode

                },

                image: imageUrl,

                user: req.user.id,

                status: "Pending",

                statusHistory: [

                    {

                        status: "Pending",

                        date: new Date()

                    }

                ]

            });


        console.log(
            "COMPLAINT CREATED:",
            complaint._id
        );


        // =================================================
        // CREATE NOTIFICATION
        // =================================================

        try {

            await Notification.create({

                user: req.user.id,

                complaint: complaint._id,

                message:
                    `Your complaint "${title}" has been submitted successfully`,

                type:
                    "COMPLAINT_CREATED"

            });


            console.log(
                "NOTIFICATION CREATED"
            );

        }

        catch (notificationError) {

            console.log(
                "NOTIFICATION ERROR:",
                notificationError
            );

        }


        // =================================================
        // RESPONSE
        // =================================================

        console.log(
            "COMPLAINT CREATION SUCCESS"
        );

        console.log(
            "========================================"
        );


        return res.status(201).json({

            message:
                "Complaint created successfully",

            complaint

        });

    }


    catch (error) {

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "CREATE COMPLAINT ERROR"
        );
        console.log(
            "========================================"
        );

        console.log(
            error
        );


        return res.status(500).json({

            message:
                "Complaint creation failed",

            error:
                error.message || "Unknown error"

        });

    }

};


// =====================================================
// GET MY COMPLAINTS (CITIZEN)
// =====================================================

const getMyComplaints = async (req, res) => {

    try {

        const complaints =
            await Complaint.find({

                user: req.user.id

            })

                .populate(

                    "user",

                    "name email mobile"

                )

                .sort({

                    createdAt: -1

    });


        return res.status(200).json(

            complaints

        );

    }


    catch (error) {

        console.log(

            "GET MY COMPLAINT ERROR:",
            error

        );


        return res.status(500).json({

            message:
                "Unable to fetch complaints",

            error:
                error.message

        });

    }

};


// =====================================================
// GET ALL COMPLAINTS (ADMIN)
// =====================================================

const getAllComplaints = async (req, res) => {

    try {

        const complaints =
            await Complaint.find()

                .populate(

                    "user",

                    "name email mobile"

                )

                .sort({

                    createdAt: -1

    });


        return res.status(200).json(

            complaints

        );

    }


    catch (error) {

        console.log(

            "GET ALL COMPLAINT ERROR:",
            error

        );


        return res.status(500).json({

            message:
                "Unable to fetch complaints",

            error:
                error.message

        });

    }

};


// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

const getComplaintById = async (req, res) => {

    try {

        const id =
            req.params.id;


        if (

            !mongoose.Types.ObjectId.isValid(id)

        ) {

            return res.status(400).json({

                message:
                    "Invalid complaint id"

            });

        }


        const complaint =
            await Complaint.findById(id)

                .populate(

                    "user",

                    "name email mobile"

                );


        if (!complaint) {

            return res.status(404).json({

                message:
                    "Complaint not found"

            });

        }


        // =================================================
        // CITIZEN SECURITY
        // =================================================

        if (

            req.user.role === "citizen"

            &&

            complaint.user._id.toString()

            !==

            req.user.id.toString()

        ) {

            return res.status(403).json({

                message:
                    "Access denied"

            });

        }


        return res.status(200).json(

            complaint

        );

    }


    catch (error) {

        console.log(

            "GET COMPLAINT ERROR:",
            error

        );


        return res.status(500).json({

            message:
                "Unable to fetch complaint",

            error:
                error.message

        });

    }

};


// =====================================================
// UPDATE COMPLAINT STATUS (ADMIN)
// =====================================================

const updateComplaintStatus = async (req, res) => {

    try {

        const {

            status

        } = req.body;


        const allowedStatus = [

            "Pending",
            "In Progress",
            "Resolved"

        ];


        if (

            !allowedStatus.includes(status)

        ) {

            return res.status(400).json({

                message:
                    "Invalid status"

            });

        }


        const complaint =
            await Complaint.findById(

                req.params.id

            );


        if (!complaint) {

            return res.status(404).json({

                message:
                    "Complaint not found"

            });

        }


        const oldStatus =
            complaint.status;


        // =================================================
        // UPDATE ONLY IF STATUS CHANGED
        // =================================================

        if (oldStatus !== status) {

            complaint.status =
                status;


            complaint.statusHistory.push({

                status,

                date: new Date()

            });


            await complaint.save();


            const notificationMessage =

                `Your complaint "${complaint.title}" status changed from ${oldStatus} to ${status}`;


            // =================================================
            // PREVENT DUPLICATE NOTIFICATION
            // =================================================

            const exists =
                await Notification.findOne({

                    user: complaint.user,

                    complaint: complaint._id,

                    message: notificationMessage

                });


            if (!exists) {

                await Notification.create({

                    user: complaint.user,

                    complaint: complaint._id,

                    message: notificationMessage,

                    type:

                        status === "Resolved"

                            ?

                            "COMPLAINT_RESOLVED"

                            :

                            "STATUS_UPDATE"

                });

            }

        }


        return res.status(200).json({

            message:
                "Complaint status updated successfully",

            complaint

        });

    }


    catch (error) {

        console.log(

            "UPDATE STATUS ERROR:",
            error

        );


        return res.status(500).json({

            message:
                "Unable to update complaint status",

            error:
                error.message

        });

    }

};


// =====================================================
// DELETE COMPLAINT (ADMIN)
// =====================================================

const deleteComplaint = async (req, res) => {

    try {

        const complaint =
            await Complaint.findById(

                req.params.id

            );


        if (!complaint) {

            return res.status(404).json({

                message:
                    "Complaint not found"

            });

        }


        // =================================================
        // CREATE NOTIFICATION BEFORE DELETE
        // =================================================

        await Notification.create({

            user: complaint.user,

            complaint: complaint._id,

            message:
                `Your complaint "${complaint.title}" has been deleted by admin`,

            type:
                "COMPLAINT_DELETED"

        });


        await Complaint.findByIdAndDelete(

            req.params.id

        );


        return res.status(200).json({

            message:
                "Complaint deleted successfully"

        });

    }


    catch (error) {

        console.log(

            "DELETE COMPLAINT ERROR:",
            error

        );


        return res.status(500).json({

            message:
                "Unable to delete complaint",

            error:
                error.message

        });

    }

};


// =====================================================
// ADMIN DASHBOARD STATISTICS
// =====================================================

const getComplaintStats = async (req, res) => {

    try {

        const total =
            await Complaint.countDocuments();


        const pending =
            await Complaint.countDocuments({

                status: "Pending"

            });


        const inProgress =
            await Complaint.countDocuments({

                status: "In Progress"

            });


        const resolved =
            await Complaint.countDocuments({

                status: "Resolved"

            });


        // =================================================
        // CATEGORY WISE COUNT
        // =================================================

        const categoryStats =
            await Complaint.aggregate([

                {

                    $group: {

                        _id: "$category",

                        count: {

                            $sum: 1

                        }

                    }

                }

            ]);


        const categories = {};


        categoryStats.forEach(item => {

            categories[item._id] =
                item.count;

        });


        return res.status(200).json({

            total,

            pending,

            inProgress,

            resolved,

            categories

        });

    }


    catch (error) {

        console.log(

            "STATS ERROR:",
            error

        );


        return res.status(500).json({

            message:
                "Unable to fetch complaint statistics",

            error:
                error.message

        });

    }

};


// =====================================================
// RECENT COMPLAINTS (ADMIN DASHBOARD)
// =====================================================

const getRecentComplaints = async (req, res) => {

    try {

        const complaints =
            await Complaint.find()

                .populate(

                    "user",

                    "name email mobile"

                )

                .sort({

                    createdAt: -1

                })

                .limit(5);


        return res.status(200).json(

            complaints

        );

    }


    catch (error) {

        console.log(

            "RECENT COMPLAINT ERROR:",
            error

        );


        return res.status(500).json({

            message:
                "Unable to fetch recent complaints",

            error:
                error.message

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