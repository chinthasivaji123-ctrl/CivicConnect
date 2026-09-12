import { useState } from "react";
import { Link } from "react-router-dom";

import "./ComplaintCard.css";

function ComplaintCard({ complaint }) {

    const [imageError, setImageError] = useState(false);

    /* =====================================================
       CATEGORY ICONS
    ===================================================== */

    const categoryIcons = {

        Garbage: "🗑️",
        Waste: "♻️",
        Electricity: "⚡",
        Water: "💧",
        Road: "🛣️",
        "Street Light": "💡",
        Drainage: "🌊",
        Sanitation: "🧹",
        Other: "📌"

    };

    /* =====================================================
       CATEGORY DISPLAY NAMES
    ===================================================== */

    const categoryNames = {

        Garbage: "Waste Management",
        Waste: "Waste Management",
        Electricity: "Electricity",
        Water: "Water Supply",
        Road: "Roads & Infrastructure",
        "Street Light": "Street Lighting",
        Drainage: "Drainage",
        Sanitation: "Sanitation",
        Other: "Other"

    };

    /* =====================================================
       DATA
    ===================================================== */

    const category =
        complaint?.category || "Other";

    const status =
        complaint?.status || "Pending";

    const priority =
        complaint?.priority || "Medium";

    const statusClass =
        status
            .toLowerCase()
            .replace(/\s+/g, "-");

    const priorityClass =
        priority.toLowerCase();

    const displayCategory =
        categoryNames[category] || category;

    const categoryIcon =
        categoryIcons[category] || "📌";

    /* =====================================================
       LOCATION
    ===================================================== */

    const getLocation = () => {

        const location =
            complaint?.address ??
            complaint?.location;

        if (!location) {

            return "Location not provided";

        }

        if (typeof location === "string") {

            return location;

        }

        if (typeof location === "object") {

            const parts = [

                location.street,
                location.city,
                location.district,
                location.state,
                location.pincode

            ].filter(Boolean);

            return parts.length
                ? parts.join(", ")
                : "Location not provided";

        }

        return "Location not provided";

    };

    /* =====================================================
       DATE
    ===================================================== */

    const getFormattedDate = () => {

        const dateValue =
            complaint?.createdAt ||
            complaint?.date;

        if (!dateValue) {

            return "Date not available";

        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {

            return "Date not available";

        }

        return date.toLocaleDateString(

            "en-IN",

            {

                day: "2-digit",
                month: "short",
                year: "numeric"

            }

        );

    };

    /* =====================================================
       IMAGE URL
    ===================================================== */

    const getImageUrl = (image) => {

        if (!image) {

            return null;

        }

        /*
         * Sometimes image can be returned
         * as an object instead of a string.
         */

        if (typeof image === "object") {

            image =
                image.secure_url ||
                image.url ||
                image.path ||
                image.filename ||
                image.public_id;

        }

        if (!image) {

            return null;

        }

        const imageValue =
            String(image).trim();

        if (!imageValue) {

            return null;

        }

        /*
         * Cloudinary HTTPS URL
         */

        if (
            imageValue.startsWith("https://res.cloudinary.com/")
        ) {

            return imageValue;

        }

        /*
         * Any other HTTPS URL
         */

        if (
            imageValue.startsWith("https://")
        ) {

            return imageValue;

        }

        /*
         * HTTP URL
         *
         * Convert to HTTPS to prevent
         * Mixed Content.
         */

        if (
            imageValue.startsWith("http://")
        ) {

            return imageValue.replace(
                /^http:\/\//i,
                "https://"
            );

        }

        /*
         * OLD LOCAL IMAGE
         *
         * Old complaints may only contain
         * the filename.
         */

        return `https://civicconnect-backend-5fbb.onrender.com/uploads/${encodeURIComponent(
            imageValue
        )}`;

    };

    const imageUrl =
        getImageUrl(complaint?.image);

    /* =====================================================
       COMPLAINT ID
    ===================================================== */

    const complaintId =
        complaint?._id
            ? String(complaint._id)
            : "N/A";

    const shortComplaintId =
        complaintId !== "N/A"
            ? `#${complaintId.slice(-8).toUpperCase()}`
            : "#N/A";

    /* =====================================================
       STATUS ICON
    ===================================================== */

    const getStatusIcon = () => {

        if (status === "Resolved") {

            return "✓";

        }

        if (status === "In Progress") {

            return "◔";

        }

        return "⌛";

    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <article
            className={`cc-card cc-status-${statusClass}`}
        >

            {/* =================================================
               TOP HEADER
            ================================================= */}

            <div className="cc-header">

                {/* CATEGORY */}

                <div
                    className="cc-category"
                    title={displayCategory}
                >

                    <span className="cc-category-icon">

                        {categoryIcon}

                    </span>

                    <span className="cc-category-text">

                        {displayCategory}

                    </span>

                </div>

                {/* STATUS */}

                <div
                    className={`cc-status cc-status-badge-${statusClass}`}
                >

                    <span className="cc-status-icon">

                        {getStatusIcon()}

                    </span>

                    <span className="cc-status-text">

                        {status}

                    </span>

                </div>

            </div>

            {/* =================================================
               MAIN CONTENT
            ================================================= */}

            <div className="cc-main">

                {/* INFORMATION */}

                <div className="cc-info">

                    {/* TITLE */}

                    <h3 className="cc-title">

                        {complaint?.title ||
                            "Untitled Complaint"}

                    </h3>

                    {/* LOCATION */}

                    <div className="cc-location">

                        <span className="cc-location-icon">

                            📍

                        </span>

                        <span className="cc-location-text">

                            {getLocation()}

                        </span>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="cc-description">

                        {complaint?.description ||
                            "No description provided."}

                    </p>

                    {/* PRIORITY */}

                    <div
                        className={`cc-priority cc-priority-${priorityClass}`}
                    >

                        <span className="cc-priority-dot"></span>

                        <span>

                            {priority}

                        </span>

                    </div>

                </div>

                {/* =================================================
                   IMAGE
                ================================================= */}

                <div className="cc-image-box">

                    {imageUrl && !imageError ? (

                        <img
                            src={imageUrl}
                            alt={
                                complaint?.title ||
                                "Complaint"
                            }
                            className="cc-image"
                            loading="lazy"
                            onError={() => {

                                console.log(
                                    "COMPLAINT IMAGE FAILED:",
                                    imageUrl
                                );

                                setImageError(true);

                            }}
                        />

                    ) : (

                        <div className="cc-no-image">

                            <div className="cc-no-image-icon">

                                🏙️

                            </div>

                            <span className="cc-no-image-text">

                                No image

                            </span>

                        </div>

                    )}

                </div>

            </div>

            {/* =================================================
               FOOTER
            ================================================= */}

            <div className="cc-footer">

                {/* DATE */}

                <div className="cc-date">

                    <span className="cc-date-icon">

                        📅

                    </span>

                    <span>

                        {getFormattedDate()}

                    </span>

                </div>

                {/* COMPLAINT ID */}

                <div className="cc-id">

                    {shortComplaintId}

                </div>

                {/* DETAILS */}

                <Link
                    to={`/citizen-complaint/${complaint?._id}`}
                    className="cc-details"
                >

                    <span>

                        View Details

                    </span>

                    <span className="cc-details-arrow">

                        →

                    </span>

                </Link>

            </div>

        </article>

    );

}

export default ComplaintCard;