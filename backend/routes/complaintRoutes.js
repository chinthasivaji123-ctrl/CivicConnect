const express = require("express");

const router = express.Router();


// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const upload = require("../middleware/upload");




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

    getComplaintStats


} = require("../controllers/complaintController");






// =====================================================
// CREATE COMPLAINT
// POST /api/complaints/create
//
// Access:
// Citizen
//
// Authentication:
// Required
//
// Upload:
// Complaint Image
// =====================================================


router.post(

    "/create",

    authMiddleware,

    upload.single("image"),

    createComplaint

);







// =====================================================
// GET LOGGED-IN USER COMPLAINTS
// GET /api/complaints/my
//
// Access:
// Citizen
//
// Purpose:
// Shows complaints created by user
// =====================================================


router.get(

    "/my",

    authMiddleware,

    getMyComplaints

);








// =====================================================
// GET ALL COMPLAINTS
// GET /api/complaints/all
//
// Access:
// Admin
//
// IMPORTANT:
// Keep this route before /:id
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
//
// Access:
// Admin
//
// Purpose:
// Dashboard Analytics
//
// Returns:
// Total complaints
// Pending count
// In Progress count
// Resolved count
// Category wise count
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
//
// Access:
// Admin
//
// Status:
// Pending
// In Progress
// Resolved
//
// Also creates notification
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
//
// Access:
// Admin
//
// Also sends notification
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
//
// Access:
// Citizen + Admin
//
// Purpose:
// Complaint details page
// =====================================================


router.get(

    "/:id",

    authMiddleware,

    getComplaintById

);








// =====================================================
// EXPORT ROUTER
// =====================================================


module.exports = router;