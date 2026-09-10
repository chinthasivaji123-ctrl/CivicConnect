import "./ComplaintDetails.css";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import API from "../api/axios";


function ComplaintDetails(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};

    const BASE_URL =
    (
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api"
    ).replace(/\/api\/?$/, "");


    // ==============================
    // FETCH COMPLAINT
    // ==============================

    const fetchComplaint = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(
                    `/complaints/${id}`
                );

            setComplaint(
                response.data
            );

            setError("");

        }
        catch(err){

            console.log(
                "FETCH ERROR",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load complaint"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchComplaint();

    }, [id]);


    // ==============================
    // REFRESH
    // ==============================

    const handleRefresh = async () => {

        setRefreshing(true);

        await fetchComplaint();

        setRefreshing(false);

    };


    // ==============================
    // UPDATE STATUS
    // ==============================

    const updateStatus = async (status) => {

        const confirmChange =
            window.confirm(
                `Change complaint status to "${status}"?`
            );

        if(!confirmChange)
            return;


        try {

            setUpdating(true);

            await API.put(
                `/complaints/status/${id}`,
                {
                    status
                }
            );

            await fetchComplaint();

        }
        catch(err){

            console.log(
                "STATUS ERROR",
                err
            );

            alert(
                err.response?.data?.message ||
                "Status update failed"
            );

        }
        finally {

            setUpdating(false);

        }

    };


    // ==============================
    // DELETE COMPLAINT
    // ==============================

    const deleteComplaint = async () => {

        const confirmDelete =
            window.confirm(
                "Delete this complaint permanently?"
            );

        if(!confirmDelete)
            return;


        try {

            await API.delete(
                `/complaints/delete/${id}`
            );

            alert(
                "Complaint deleted successfully"
            );

            navigate(
                user.role?.toLowerCase() === "admin"
                ?
                "/admin-dashboard"
                :
                "/citizen-dashboard"
            );

        }
        catch(err){

            console.log(
                "DELETE ERROR",
                err
            );

            alert(
                err.response?.data?.message ||
                "Delete failed"
            );

        }

    };


    // ==============================
    // HELPERS
    // ==============================

    const getStatusClass = (status) => {

        return String(status || "Pending")
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    const getLocationParts = () => {

        return [
            complaint?.address?.street,
            complaint?.address?.city,
            complaint?.address?.district,
            complaint?.address?.state,
            complaint?.address?.pincode
        ].filter(Boolean);

    };


    const formatDate = (date) => {

        if(!date)
            return "Not available";

        return new Date(date)
            .toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    };


    const formatId = (value) => {

        if(!value)
            return "N/A";

        return String(value)
            .slice(-10)
            .toUpperCase();

    };


    const getPriorityClass = (priority) => {

        return String(priority || "Medium")
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    // ==============================
    // LOADING
    // ==============================

    if(loading){

        return(

            <div className="details-loading">

                <div className="loading-orb">
                    🏙️
                </div>

                <h2>
                    Loading Complaint...
                </h2>

                <p>
                    Please wait while we fetch the complaint details.
                </p>

            </div>

        );

    }


    // ==============================
    // ERROR
    // ==============================

    if(error || !complaint){

        return(

            <div className="details-error-page">

                <div className="details-error-card">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        {error || "Complaint not found"}
                    </h2>

                    <p>
                        We couldn't load this complaint.
                    </p>

                    <button
                        className="error-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Go Back
                    </button>

                </div>

            </div>

        );

    }


    const statusClass =
        getStatusClass(
            complaint.status
        );

    const priority =
        complaint.priority || "Medium";

    const locationParts =
        getLocationParts();

    const isAdmin =
        user.role?.toLowerCase() === "admin";

    const isPending =
        complaint.status === "Pending";

    const isInProgress =
        complaint.status === "In Progress";

    const isResolved =
        complaint.status === "Resolved";


    const history =
        complaint.statusHistory || [];


    return(

        <div className="details-page">

            <div className="details-container">


                {/* ==============================
                    HEADER
                ============================== */}

                <div className="details-header">

                    <div className="header-left">

                        <button
                            className="back-btn"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>

                        <div className="header-title-block">

                            <span className="eyebrow">
                                CASE MANAGEMENT
                            </span>

                            <h1>
                                Complaint Details
                            </h1>

                            <p>
                                Review complaint information,
                                evidence and status history.
                            </p>

                        </div>

                    </div>


                    <button
                        className="refresh-btn"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        {refreshing
                            ? "↻ Refreshing..."
                            : "↻ Refresh"
                        }
                    </button>

                </div>


                {/* ==============================
                    CASE SUMMARY
                ============================== */}

                <div className="case-summary">

                    <div className="case-summary-left">

                        <span className="case-label">
                            COMPLAINT ID
                        </span>

                        <strong>
                            #{formatId(complaint._id)}
                        </strong>

                        <span className="full-id">
                            {complaint._id}
                        </span>

                    </div>


                    <div className="case-summary-right">

                        <span
                            className={`status-badge ${statusClass}`}
                        >
                            <span className="status-dot"></span>
                            {complaint.status || "Pending"}
                        </span>

                        <span
                            className={`priority-badge ${getPriorityClass(priority)}`}
                        >
                            {priority} Priority
                        </span>

                    </div>

                </div>


                {/* ==============================
                    MAIN GRID
                ============================== */}

                <div className="details-grid">


                    {/* ==============================
                        LEFT CONTENT
                    ============================== */}

                    <div className="left-section">


                        {/* COMPLAINT HERO */}

                        <section className="complaint-hero">

                            <span className="section-kicker">
                                REPORTED ISSUE
                            </span>

                            <h2>
                                {complaint.title}
                            </h2>

                            <p className="description-text">
                                {complaint.description ||
                                "No description provided."}
                            </p>

                            <div className="submitted-line">
                                <span>
                                    🕐
                                </span>

                                Submitted on{" "}
                                <strong>
                                    {formatDate(
                                        complaint.createdAt
                                    )}
                                </strong>
                            </div>

                        </section>


                        {/* INFORMATION CARDS */}

                        <section className="info-section">

                            <div className="section-heading">

                                <div className="section-icon">
                                    📋
                                </div>

                                <div>
                                    <span>
                                        CASE INFORMATION
                                    </span>

                                    <h3>
                                        Complaint Overview
                                    </h3>
                                </div>

                            </div>


                            <div className="info-card-grid">

                                <div className="info-card">

                                    <span className="info-icon">
                                        🏷️
                                    </span>

                                    <div>
                                        <small>
                                            CATEGORY
                                        </small>

                                        <strong>
                                            {complaint.category ||
                                            "Not available"}
                                        </strong>
                                    </div>

                                </div>


                                <div className="info-card">

                                    <span className="info-icon">
                                        🎯
                                    </span>

                                    <div>
                                        <small>
                                            PRIORITY
                                        </small>

                                        <strong>
                                            {priority}
                                        </strong>
                                    </div>

                                </div>


                                <div className="info-card">

                                    <span className="info-icon">
                                        📅
                                    </span>

                                    <div>
                                        <small>
                                            SUBMITTED
                                        </small>

                                        <strong>
                                            {formatDate(
                                                complaint.createdAt
                                            )}
                                        </strong>
                                    </div>

                                </div>


                                <div className="info-card">

                                    <span className="info-icon">
                                        🔄
                                    </span>

                                    <div>
                                        <small>
                                            CURRENT STATUS
                                        </small>

                                        <strong>
                                            {complaint.status ||
                                            "Pending"}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* CITIZEN INFORMATION */}

                        <section className="info-section">

                            <div className="section-heading">

                                <div className="section-icon">
                                    👤
                                </div>

                                <div>
                                    <span>
                                        CITIZEN
                                    </span>

                                    <h3>
                                        Reported By
                                    </h3>
                                </div>

                            </div>


                            <div className="citizen-card">

                                <div className="citizen-avatar">
                                    {(complaint.user?.name ||
                                    "C")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>


                                <div className="citizen-main">

                                    <strong>
                                        {complaint.user?.name ||
                                        "Not Available"}
                                    </strong>

                                    <span>
                                        Citizen
                                    </span>

                                </div>


                                <div className="citizen-contact">

                                    <div>
                                        <small>
                                            EMAIL
                                        </small>

                                        <strong>
                                            {complaint.user?.email ||
                                            "Not Available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            MOBILE
                                        </small>

                                        <strong>
                                            {complaint.user?.mobile ||
                                            "Not Available"}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* LOCATION */}

                        <section className="info-section">

                            <div className="section-heading">

                                <div className="section-icon location-icon">
                                    📍
                                </div>

                                <div>
                                    <span>
                                        LOCATION
                                    </span>

                                    <h3>
                                        Complaint Location
                                    </h3>
                                </div>

                            </div>


                            <div className="location-card">

                                <div className="location-main">

                                    <div className="location-pin">
                                        📍
                                    </div>

                                    <div>

                                        <strong>
                                            {locationParts.length
                                                ? locationParts.join(", ")
                                                : "Location not available"}
                                        </strong>

                                        <span>
                                            Reported complaint address
                                        </span>

                                    </div>

                                </div>


                                <div className="location-details">

                                    <div>
                                        <small>
                                            STREET
                                        </small>

                                        <strong>
                                            {complaint.address?.street ||
                                            "—"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            CITY
                                        </small>

                                        <strong>
                                            {complaint.address?.city ||
                                            "—"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            DISTRICT
                                        </small>

                                        <strong>
                                            {complaint.address?.district ||
                                            "—"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            STATE
                                        </small>

                                        <strong>
                                            {complaint.address?.state ||
                                            "—"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            PINCODE
                                        </small>

                                        <strong>
                                            {complaint.address?.pincode ||
                                            "—"}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* DESCRIPTION */}

                        <section className="description-panel">

                            <div className="section-heading">

                                <div className="section-icon">
                                    📝
                                </div>

                                <div>
                                    <span>
                                        DESCRIPTION
                                    </span>

                                    <h3>
                                        Issue Details
                                    </h3>
                                </div>

                            </div>

                            <div className="description-box">

                                {complaint.description ||
                                "No description provided."}

                            </div>

                        </section>

                    </div>


                    {/* ==============================
                        RIGHT CONTENT
                    ============================== */}

                    <div className="right-section">


                        {/* EVIDENCE */}

                        <section className="side-card evidence-card">

                            <div className="side-card-header">

                                <div>
                                    <span>
                                        EVIDENCE
                                    </span>

                                    <h3>
                                        Complaint Image
                                    </h3>
                                </div>

                                <span className="mini-badge">
                                    {complaint.image
                                        ? "Uploaded"
                                        : "None"}
                                </span>

                            </div>


                            {complaint.image
                                ?

                                <div className="image-wrapper">

                                    <img
                                        src={`${BASE_URL}/uploads/${complaint.image}`}
                                        className="details-image"
                                        alt="Complaint evidence"
                                    />

                                </div>

                                :

                                <div className="no-image">

                                    <div className="no-image-icon">
                                        📷
                                    </div>

                                    <strong>
                                        No Image Uploaded
                                    </strong>

                                    <span>
                                        No visual evidence was attached
                                        to this complaint.
                                    </span>

                                </div>
                            }

                        </section>


                        {/* STATUS PROGRESS */}

                        <section className="side-card progress-card">

                            <div className="side-card-header">

                                <div>
                                    <span>
                                        WORKFLOW
                                    </span>

                                    <h3>
                                        Complaint Progress
                                    </h3>
                                </div>

                                <span className={`workflow-state ${statusClass}`}>
                                    {complaint.status}
                                </span>

                            </div>


                            <div className="progress-track">

                                <div
                                    className={`progress-step ${
                                        isPending ||
                                        isInProgress ||
                                        isResolved
                                            ? "completed"
                                            : ""
                                    }`}
                                >

                                    <div className="step-dot">
                                        {isPending ||
                                        isInProgress ||
                                        isResolved
                                            ? "✓"
                                            : "1"}
                                    </div>

                                    <div>
                                        <strong>
                                            Pending
                                        </strong>

                                        <span>
                                            Complaint received
                                        </span>
                                    </div>

                                </div>


                                <div
                                    className={`progress-step ${
                                        isInProgress ||
                                        isResolved
                                            ? "completed"
                                            : ""
                                    }`}
                                >

                                    <div className="step-dot">
                                        {isInProgress ||
                                        isResolved
                                            ? "✓"
                                            : "2"}
                                    </div>

                                    <div>
                                        <strong>
                                            In Progress
                                        </strong>

                                        <span>
                                            Work has started
                                        </span>

                                    </div>

                                </div>


                                <div
                                    className={`progress-step ${
                                        isResolved
                                            ? "completed"
                                            : ""
                                    }`}
                                >

                                    <div className="step-dot">
                                        {isResolved
                                            ? "✓"
                                            : "3"}
                                    </div>

                                    <div>
                                        <strong>
                                            Resolved
                                        </strong>

                                        <span>
                                            Issue completed
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* STATUS TIMELINE */}

                        <section className="side-card timeline-card">

                            <div className="side-card-header">

                                <div>
                                    <span>
                                        HISTORY
                                    </span>

                                    <h3>
                                        Status Timeline
                                    </h3>
                                </div>

                                <span className="history-count">
                                    {history.length}
                                </span>

                            </div>


                            <div className="timeline">

                                {history.length

                                    ?

                                    history.map(
                                        (item, index) => {

                                            const itemClass =
                                                getStatusClass(
                                                    item.status
                                                );

                                            return(

                                                <div
                                                    className={`timeline-item ${itemClass}`}
                                                    key={index}
                                                >

                                                    <div className="timeline-marker">
                                                        ✓
                                                    </div>

                                                    <div className="timeline-content">

                                                        <strong>
                                                            {item.status}
                                                        </strong>

                                                        <small>
                                                            {formatDate(
                                                                item.date
                                                            )}
                                                        </small>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )

                                    :

                                    <div className="timeline-empty">
                                        No status updates yet.
                                    </div>
                                }

                            </div>

                        </section>


                        {/* ADMIN CONTROLS */}

                        {isAdmin && (

                            <section className="side-card admin-actions-card">

                                <div className="side-card-header">

                                    <div>
                                        <span>
                                            ADMIN ACTIONS
                                        </span>

                                        <h3>
                                            Manage Complaint
                                        </h3>
                                    </div>

                                </div>


                                <div className="button-group">

                                    {isPending && (

                                        <button
                                            className="progress-btn"
                                            disabled={updating}
                                            onClick={() =>
                                                updateStatus(
                                                    "In Progress"
                                                )
                                            }
                                        >
                                            <span>🔨</span>
                                            {updating
                                                ? "Updating..."
                                                : "Start Work"
                                            }
                                        </button>

                                    )}


                                    {isInProgress && (

                                        <button
                                            className="resolve-btn"
                                            disabled={updating}
                                            onClick={() =>
                                                updateStatus(
                                                    "Resolved"
                                                )
                                            }
                                        >
                                            <span>✓</span>
                                            {updating
                                                ? "Updating..."
                                                : "Resolve Complaint"
                                            }
                                        </button>

                                    )}


                                    {isResolved && (

                                        <div className="resolved-message">
                                            <span>
                                                ✓
                                            </span>

                                            <div>
                                                <strong>
                                                    Complaint Resolved
                                                </strong>

                                                <small>
                                                    This complaint has been
                                                    marked as completed.
                                                </small>
                                            </div>
                                        </div>

                                    )}


                                    <button
                                        className="delete-btn"
                                        onClick={deleteComplaint}
                                    >
                                        <span>🗑</span>
                                        Delete Complaint
                                    </button>

                                </div>

                            </section>

                        )}

                    </div>

                </div>


                {/* ==============================
                    FOOTER ACTION
                ============================== */}

                <div className="details-footer">

                    <div>

                        <span>
                            CIVICCONNECT CASE MANAGEMENT
                        </span>

                        <strong>
                            Helping communities resolve
                            issues faster.
                        </strong>

                    </div>


                    <button
                        onClick={() => navigate(-1)}
                    >
                        ← Back to Complaints
                    </button>

                </div>

            </div>

        </div>

    );

}


export default ComplaintDetails;
