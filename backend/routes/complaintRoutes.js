const express = require("express");

const router = express.Router();


// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const upload =
    require("../middleware/upload");



// =====================================================
// CONTROLLERS
// =====================================================

const {

    createComplaint,

    getMyComplaints,

    getAllComplaints,

    getComplaintById,

    updateComplaintStatus,

    deleteComplaint,

    getComplaintStats,

    getRecentComplaints

} = require("../controllers/complaintController");


// =====================================================
// CREATE COMPLAINT
// POST /api/complaints/create
// =====================================================

router.post(

    "/create",

    authMiddleware,

    (req, res, next) => {

        console.log("");
        console.log("========================================");
        console.log("CREATE COMPLAINT ROUTE REACHED");
        console.log("========================================");

        upload.single("image")(req, res, (error) => {

            if (error) {

                console.log("");
                console.log("========================================");
                console.log("MULTER ERROR");
                console.log("========================================");

                console.log("Error name:", error.name);
                console.log("Error message:", error.message);
                console.log("Error code:", error.code);

                return res.status(400).json({

                    success: false,

                    message:
                        error.message ||
                        "Image upload middleware failed",

                    error:
                        error.code || error.name

                });

            }

            console.log("✅ MULTER PROCESSING SUCCESS");

            console.log(
                "File:",
                req.file
                    ? {
                        originalname: req.file.originalname,
                        mimetype: req.file.mimetype,
                        size: req.file.size
                    }
                    : "NO FILE"
            );

            next();

        });

    },

    createComplaint

);


// =====================================================
// GET MY COMPLAINTS
// GET /api/complaints/my
// =====================================================

router.get(

    "/my",

    authMiddleware,

    getMyComplaints

);


// =====================================================
// GET ALL COMPLAINTS
// GET /api/complaints/all
// =====================================================

router.get(

    "/all",

    authMiddleware,

    adminMiddleware,

    getAllComplaints

);


// =====================================================
// GET COMPLAINT STATISTICS
// GET /api/complaints/stats
// =====================================================

router.get(

    "/stats",

    authMiddleware,

    adminMiddleware,

    getComplaintStats

);


// =====================================================
// UPDATE COMPLAINT STATUS
// PUT /api/complaints/status/:id
// =====================================================

router.put(

    "/status/:id",

    authMiddleware,

    adminMiddleware,

    updateComplaintStatus

);


// =====================================================
// DELETE COMPLAINT
// DELETE /api/complaints/delete/:id
// =====================================================

router.delete(

    "/delete/:id",

    authMiddleware,

    adminMiddleware,

    deleteComplaint

);


// =====================================================
// GET SINGLE COMPLAINT
// GET /api/complaints/:id
// =====================================================

router.get(

    "/:id",

    authMiddleware,

    getComplaintById

);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;