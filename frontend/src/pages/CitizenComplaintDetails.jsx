import "./CitizenComplaintDetails.css";

import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import API from "../api/axios";

import ComplaintTimeline from "../components/ComplaintTimeline";


function CitizenComplaintDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [complaint, setComplaint] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");


   const BASE_URL =
    (
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api"
    ).replace(/\/api\/?$/, "");


    // ================= FETCH COMPLAINT =================

    const fetchComplaint = async () => {

        try {

            setError("");

            const response = await API.get(
                `/complaints/${id}`
            );

            setComplaint(response.data);

        }

        catch (err) {

            console.log(
                "FETCH COMPLAINT ERROR",
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


    // ================= REFRESH =================

    const refreshData = async () => {

        setRefreshing(true);

        await fetchComplaint();

        setRefreshing(false);

    };


    // ================= DATE =================

    const formatDate = (date) => {

        if (!date) {
            return "Not Available";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    const formatDateTime = (date) => {

        if (!date) {
            return "Not Available";
        }

        return new Date(date).toLocaleString(
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


    // ================= STATUS =================

    const getStatusIcon = (status) => {

        if (status === "Resolved") {
            return "✓";
        }

        if (status === "In Progress") {
            return "⚙";
        }

        return "!";
    };


    const getStatusClass = (status) => {

        return (status || "Pending")
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    // ================= PRIORITY =================

    const getPriorityClass = (priority) => {

        return (priority || "Medium")
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    // ================= LOADING =================

    if (loading) {

        return (

            <div className="details-loading">

                <div className="details-loader">

                    <div className="loader-icon">
                        🏙️
                    </div>

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading Complaint Details
                    </h2>

                    <p>
                        Please wait while we fetch your complaint...
                    </p>

                </div>

            </div>

        );

    }


    // ================= ERROR =================

    if (error || !complaint) {

        return (

            <div className="details-loading">

                <div className="error-card">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        {error || "Complaint not found"}
                    </h2>

                    <p>
                        We couldn't retrieve the complaint details.
                    </p>

                    <button
                        className="error-back-btn"
                        onClick={() =>
                            navigate("/citizen-dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    const status =
        complaint.status || "Pending";

    const statusClass =
        getStatusClass(status);

    const priority =
        complaint.priority || "Medium";

    const priorityClass =
        getPriorityClass(priority);


    const steps = [
        "Pending",
        "In Progress",
        "Resolved"
    ];


    const currentStep =
        steps.indexOf(status);


    return (

        <div className="citizen-details-page">

            <div className="citizen-details-container">


                {/* =====================================================
                    TOP NAVIGATION
                ===================================================== */}

                <div className="details-topbar">

                    <div className="details-brand">

                        <div className="details-brand-icon">
                            🏙️
                        </div>

                        <div>
                            <h3>
                                CivicConnect
                            </h3>

                            <span>
                                Complaint Details
                            </span>
                        </div>

                    </div>


                    <div className="top-actions">

                        <button
                            className="back-btn"
                            onClick={() =>
                                navigate("/citizen-dashboard")
                            }
                        >
                            ← Dashboard
                        </button>


                        <button
                            className="refresh-details-btn"
                            onClick={refreshData}
                            disabled={refreshing}
                        >

                            <span
                                className={
                                    refreshing
                                        ? "refresh-icon spinning"
                                        : "refresh-icon"
                                }
                            >
                                ↻
                            </span>

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"
                            }

                        </button>

                    </div>

                </div>


                {/* =====================================================
                    HERO HEADER
                ===================================================== */}

                <div className="details-hero">

                    <div className="hero-content">

                        <div className="hero-eyebrow">
                            <span className="eyebrow-dot"></span>
                            CITIZEN COMPLAINT
                        </div>


                        <h1>
                            {complaint.title}
                        </h1>


                        <div className="hero-meta">

                            <span className="complaint-id">
                                ID: {complaint._id}
                            </span>

                            <span className="meta-divider">
                                •
                            </span>

                            <span className="submitted-date">
                                Submitted {formatDate(complaint.createdAt)}
                            </span>

                        </div>

                    </div>


                    <div className="hero-status-wrapper">

                        <span
                            className={`status-badge ${statusClass}`}
                        >

                            <span className="status-icon">
                                {getStatusIcon(status)}
                            </span>

                            {status}

                        </span>

                    </div>

                </div>


                {/* =====================================================
                    QUICK SUMMARY
                ===================================================== */}

                <div className="quick-summary">

                    <div className="summary-item">

                        <div className="summary-icon category-icon">
                            📋
                        </div>

                        <div>

                            <span>
                                Category
                            </span>

                            <strong>
                                {complaint.category || "General"}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-item">

                        <div className="summary-icon priority-icon">
                            ⚡
                        </div>

                        <div>

                            <span>
                                Priority
                            </span>

                            <strong
                                className={`priority-text ${priorityClass}`}
                            >
                                {priority}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-item">

                        <div className="summary-icon date-icon">
                            📅
                        </div>

                        <div>

                            <span>
                                Submitted
                            </span>

                            <strong>
                                {formatDate(complaint.createdAt)}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-item">

                        <div className="summary-icon location-icon">
                            📍
                        </div>

                        <div>

                            <span>
                                Location
                            </span>

                            <strong>
                                {complaint.address?.city || "Not Available"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <div className="details-main-grid">


                    {/* ================= LEFT COLUMN ================= */}

                    <div className="details-left-column">


                        {/* IMAGE / EVIDENCE */}

                        <div className="evidence-card">

                            <div className="section-heading">

                                <div className="section-heading-icon">
                                    📷
                                </div>

                                <div>

                                    <h2>
                                        Complaint Evidence
                                    </h2>

                                    <p>
                                        Image submitted with your complaint
                                    </p>

                                </div>

                            </div>


                            {
                                complaint.image

                                    ?

                                    <div className="details-image">

                                        <img
                                            src={`${BASE_URL}/uploads/${complaint.image}`}
                                            alt="Complaint evidence"
                                        />

                                        <div className="image-overlay">

                                            <span>
                                                Complaint Evidence
                                            </span>

                                        </div>

                                    </div>

                                    :

                                    <div className="no-details-image">

                                        <div className="no-image-icon">
                                            📷
                                        </div>

                                        <h3>
                                            No Image Available
                                        </h3>

                                        <p>
                                            No evidence image was uploaded for this complaint.
                                        </p>

                                    </div>
                            }

                        </div>


                        {/* DESCRIPTION */}

                        <div className="details-section">

                            <div className="section-heading">

                                <div className="section-heading-icon blue">
                                    📝
                                </div>

                                <div>

                                    <h2>
                                        Problem Description
                                    </h2>

                                    <p>
                                        Details provided by you
                                    </p>

                                </div>

                            </div>


                            <div className="description-box">

                                <p>
                                    {
                                        complaint.description ||
                                        "No description provided."
                                    }
                                </p>

                            </div>

                        </div>


                        {/* LOCATION */}

                        <div className="location-card">

                            <div className="section-heading">

                                <div className="section-heading-icon green">
                                    📍
                                </div>

                                <div>

                                    <h2>
                                        Complaint Location
                                    </h2>

                                    <p>
                                        Where the issue was reported
                                    </p>

                                </div>

                            </div>


                            <div className="location-grid">

                                <div className="location-item">

                                    <span>
                                        State
                                    </span>

                                    <strong>
                                        {complaint.address?.state || "-"}
                                    </strong>

                                </div>


                                <div className="location-item">

                                    <span>
                                        District
                                    </span>

                                    <strong>
                                        {complaint.address?.district || "-"}
                                    </strong>

                                </div>


                                <div className="location-item">

                                    <span>
                                        City
                                    </span>

                                    <strong>
                                        {complaint.address?.city || "-"}
                                    </strong>

                                </div>


                                <div className="location-item">

                                    <span>
                                        Street
                                    </span>

                                    <strong>
                                        {complaint.address?.street || "-"}
                                    </strong>

                                </div>


                                <div className="location-item">

                                    <span>
                                        Pincode
                                    </span>

                                    <strong>
                                        {complaint.address?.pincode || "-"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                    </div>


                    {/* ================= RIGHT COLUMN ================= */}

                    <div className="details-right-column">


                        {/* COMPLAINT INFORMATION */}

                        <div className="info-card">

                            <div className="card-title">

                                <div className="card-title-icon">
                                    📋
                                </div>

                                <div>

                                    <h3>
                                        Complaint Information
                                    </h3>

                                    <p>
                                        Submission details
                                    </p>

                                </div>

                            </div>


                            <div className="info-list">

                                <div className="info-row">

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {complaint.category || "General"}
                                    </strong>

                                </div>


                                <div className="info-row">

                                    <span>
                                        Priority
                                    </span>

                                    <strong
                                        className={`priority-value ${priorityClass}`}
                                    >
                                        {priority}
                                    </strong>

                                </div>


                                <div className="info-row">

                                    <span>
                                        Submitted
                                    </span>

                                    <strong>
                                        {formatDate(complaint.createdAt)}
                                    </strong>

                                </div>


                                <div className="info-row">

                                    <span>
                                        Last Updated
                                    </span>

                                    <strong>
                                        {
                                            complaint.statusHistory?.length
                                                ?
                                                formatDateTime(
                                                    complaint.statusHistory[
                                                        complaint.statusHistory.length - 1
                                                    ]?.date
                                                )
                                                :
                                                "No updates yet"
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* CURRENT STATUS */}

                        <div className={`current-status-card ${statusClass}`}>

                            <div className="current-status-top">

                                <div className="current-status-icon">

                                    {getStatusIcon(status)}

                                </div>

                                <div>

                                    <span>
                                        CURRENT STATUS
                                    </span>

                                    <h3>
                                        {status}
                                    </h3>

                                </div>

                            </div>


                            <p>

                                {
                                    status === "Resolved"

                                        ?

                                        "Your complaint has been successfully resolved."

                                        :

                                        status === "In Progress"

                                            ?

                                            "Our team is currently working on your complaint."

                                            :

                                            "Your complaint has been received and is waiting to be processed."
                                }

                            </p>

                        </div>


                        {/* STATUS PROGRESS */}

                        <div className="status-tracker">

                            <div className="tracker-header">

                                <div>

                                    <h2>
                                        🚦 Complaint Progress
                                    </h2>

                                    <p>
                                        Track the current stage of your complaint
                                    </p>

                                </div>

                                <span className="progress-count">

                                    {
                                        currentStep >= 0
                                            ? `${currentStep + 1}/3`
                                            : "1/3"
                                    }

                                </span>

                            </div>


                            <div className="progress-wrapper">

                                <div className="progress-line"></div>


                                {
                                    steps.map((step, index) => {

                                        const completed =
                                            index <= currentStep;

                                        const active =
                                            index === currentStep;


                                        return (

                                            <div
                                                key={step}
                                                className={
                                                    `progress-item
                                                    ${completed ? "completed" : ""}
                                                    ${active ? "active" : ""}`
                                                }
                                            >

                                                <div className="progress-circle">

                                                    {
                                                        completed
                                                            ?
                                                            "✓"
                                                            :
                                                            index + 1
                                                    }

                                                </div>


                                                <div className="progress-label">

                                                    <strong>
                                                        {step}
                                                    </strong>

                                                    <span>

                                                        {
                                                            step === "Pending"
                                                                ?
                                                                "Submitted"
                                                                :
                                                                step === "In Progress"
                                                                    ?
                                                                    "Being reviewed"
                                                                    :
                                                                    "Completed"
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                        );

                                    })
                                }

                            </div>

                        </div>


                    </div>

                </div>


                {/* =====================================================
                    TIMELINE
                ===================================================== */}

                <div className="timeline-section">

                    <div className="timeline-header">

                        <div className="section-heading">

                            <div className="section-heading-icon purple">
                                📅
                            </div>

                            <div>

                                <h2>
                                    Complaint Timeline
                                </h2>

                                <p>
                                    Follow every update made to your complaint
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="timeline-content">

                        <ComplaintTimeline
                            history={
                                complaint.statusHistory || []
                            }
                        />

                    </div>

                </div>


                {/* =====================================================
                    FOOTER ACTION
                ===================================================== */}

                <div className="details-footer">

                    <div className="footer-message">

                        <div className="footer-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                Need to report another issue?
                            </strong>

                            <span>
                                Help improve your community with CivicConnect.
                            </span>

                        </div>

                    </div>


                    <button
                        className="report-new-btn"
                        onClick={() =>
                            navigate("/create-complaint")
                        }
                    >
                        + Report New Issue
                    </button>

                </div>


            </div>

        </div>

    );

}


export default CitizenComplaintDetails;