const multer = require("multer");

// =====================================================
// STORAGE
// =====================================================

const storage = multer.memoryStorage();


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {

    console.log("");
    console.log("========================================");
    console.log("MULTER FILE CHECK");
    console.log("========================================");

    console.log("Field name:", file.fieldname);
    console.log("Original name:", file.originalname);
    console.log("MIME type:", file.mimetype);

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        console.log("✅ IMAGE TYPE ACCEPTED");

        cb(null, true);

    }
    else {

        console.log("❌ IMAGE TYPE REJECTED");

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );

    }

};


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({

    storage: storage,

    limits: {

        fileSize: 10 * 1024 * 1024

    },

    fileFilter: fileFilter

});


// =====================================================
// EXPORT
// =====================================================

module.exports = upload;