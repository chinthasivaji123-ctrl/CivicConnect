const User = require("../models/User");
const Complaint = require("../models/Complaint");


// ==========================================
// GET PROFILE
// ==========================================
const getProfile = async (req, res) => {

    try {

        console.log("================================");
        console.log("PROFILE CONTROLLER CALLED");
        console.log("USER ID:", req.user.id);
        console.log("================================");


        // ==========================================
        // FIND USER
        // ==========================================
        const user = await User.findById(req.user.id);


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        console.log("USER FOUND:", true);

        console.log(
            "CREATED AT BEFORE FIX:",
            user.createdAt
        );

        console.log(
            "UPDATED AT:",
            user.updatedAt
        );


        // ==========================================
        // FIX OLD USERS
        // ==========================================
        let createdAt = user.createdAt;


        if (!createdAt) {

            // Use existing updatedAt if available
            // Otherwise use current date
            createdAt =
                user.updatedAt ||
                new Date();


            console.log(
                "ADDING CREATED AT:",
                createdAt
            );


            // ==========================================
            // DIRECT DATABASE UPDATE
            // ==========================================
            const result =
                await User.collection.updateOne(
                    {
                        _id: user._id
                    },
                    {
                        $set: {
                            createdAt: createdAt
                        }
                    }
                );


            console.log(
                "DATABASE UPDATE RESULT:",
                result
            );

        }


        // ==========================================
        // PROFILE DATA
        // ==========================================
        let profileData = {

            id: user._id,

            name: user.name,

            email: user.email,

            mobile: user.mobile || "",

            role: user.role,

            createdAt: createdAt

        };


        // ==========================================
        // CITIZEN STATISTICS
        // ==========================================
        if (user.role === "citizen") {


            const totalComplaints =
                await Complaint.countDocuments({
                    user: user._id
                });


            const pending =
                await Complaint.countDocuments({
                    user: user._id,
                    status: "Pending"
                });


            const inProgress =
                await Complaint.countDocuments({
                    user: user._id,
                    status: "In Progress"
                });


            const resolved =
                await Complaint.countDocuments({
                    user: user._id,
                    status: "Resolved"
                });


            profileData = {

                ...profileData,

                totalComplaints,

                pending,

                inProgress,

                resolved

            };

        }


        // ==========================================
        // ADMIN STATISTICS
        // ==========================================
        else if (user.role === "admin") {


            const totalComplaints =
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


            profileData = {

                ...profileData,

                totalComplaints,

                pending,

                inProgress,

                resolved

            };

        }


        // ==========================================
        // FINAL DEBUG
        // ==========================================
        console.log(
            "FINAL CREATED AT:",
            profileData.createdAt
        );


        // ==========================================
        // SEND RESPONSE
        // ==========================================
        res.status(200).json(profileData);


    } catch (error) {

        console.log(
            "PROFILE ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Unable to fetch profile"

        });

    }

};


// ==========================================
// UPDATE PROFILE
// ==========================================
const updateProfile = async (req, res) => {

    try {

        const {
            name,
            mobile
        } = req.body;


        // ==========================================
        // VALIDATE NAME
        // ==========================================
        if (!name || !name.trim()) {

            return res.status(400).json({

                message:
                    "Name is required"

            });

        }


        // ==========================================
        // FIND USER
        // ==========================================
        const user =
            await User.findById(req.user.id);


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // ==========================================
        // UPDATE NAME
        // ==========================================
        user.name =
            name.trim();


        // ==========================================
        // UPDATE MOBILE
        // ==========================================
        user.mobile =
            mobile
                ? mobile.trim()
                : "";


        // ==========================================
        // FIX CREATED DATE FOR OLD USER
        // ==========================================
        let createdAt =
            user.createdAt;


        if (!createdAt) {

            createdAt =
                user.updatedAt ||
                new Date();


            await User.collection.updateOne(

                {
                    _id: user._id
                },

                {
                    $set: {
                        createdAt: createdAt
                    }
                }

            );

        }


        // ==========================================
        // UPDATE UPDATED DATE
        // ==========================================
        await User.collection.updateOne(

            {
                _id: user._id
            },

            {
                $set: {
                    name: user.name,
                    mobile: user.mobile,
                    updatedAt: new Date()
                }
            }

        );


        // ==========================================
        // RESPONSE
        // ==========================================
        res.status(200).json({

            message:
                "Profile updated successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                mobile: user.mobile,

                role: user.role,

                createdAt: createdAt

            }

        });


    } catch (error) {

        console.log(
            "UPDATE PROFILE ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Unable to update profile"

        });

    }

};


// ==========================================
// EXPORT
// ==========================================
module.exports = {

    getProfile,

    updateProfile

};