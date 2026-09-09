import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import ComplaintCard from "../components/ComplaintCard";

import "./CitizenDashboard.css";


function CitizenDashboard() {

    const [complaints, setComplaints] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [sortOrder, setSortOrder] = useState("Newest First");

    const [sortOpen, setSortOpen] = useState(false);

    const [error, setError] = useState("");

    const sortRef = useRef(null);


    /* =====================================================
       CLOSE SORT DROPDOWN WHEN CLICKING OUTSIDE
    ===================================================== */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                sortRef.current &&
                !sortRef.current.contains(event.target)
            ) {
                setSortOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    /* =====================================================
       FETCH COMPLAINTS
    ===================================================== */

    const fetchComplaints = useCallback(async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await API.get("/complaints/my");

            const data = response?.data;

            if (Array.isArray(data)) {

                setComplaints(data);

            } else if (Array.isArray(data?.complaints)) {

                setComplaints(data.complaints);

            } else {

                setComplaints([]);

            }

        } catch (err) {

            console.error("Error fetching complaints:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to load your complaints. Please try again."
            );

        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    }, []);


    useEffect(() => {

        fetchComplaints();

    }, [fetchComplaints]);


    /* =====================================================
       LOCATION
    ===================================================== */

    const getLocation = (complaint) => {

        const location =
            complaint?.address ??
            complaint?.location;

        if (!location) {
            return "Location unavailable";
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
                : "Location unavailable";
        }

        return "Location unavailable";
    };


    /* =====================================================
       STATUS COUNTS
    ===================================================== */

    const total = complaints.length;

    const pending = complaints.filter(
        complaint => complaint?.status === "Pending"
    ).length;

    const progress = complaints.filter(
        complaint => complaint?.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
        complaint => complaint?.status === "Resolved"
    ).length;


    const improvement =
        total > 0
            ? Math.round((resolved / total) * 100)
            : 0;


    /* =====================================================
       FILTER + SEARCH + SORT
    ===================================================== */

    const filteredComplaints = useMemo(() => {

        let result = [...complaints];


        /* STATUS */

        if (statusFilter !== "All") {

            result = result.filter(
                complaint =>
                    complaint?.status === statusFilter
            );

        }


        /* SEARCH */

        const searchText =
            search.trim().toLowerCase();

        if (searchText) {

            result = result.filter(complaint => {

                const title =
                    complaint?.title || "";

                const description =
                    complaint?.description || "";

                const category =
                    complaint?.category || "";

                const location =
                    getLocation(complaint);

                return (
                    title.toLowerCase().includes(searchText) ||
                    description.toLowerCase().includes(searchText) ||
                    category.toLowerCase().includes(searchText) ||
                    location.toLowerCase().includes(searchText)
                );

            });

        }


        /* SORT */

        result.sort((a, b) => {

            const dateA =
                new Date(a?.createdAt || 0).getTime();

            const dateB =
                new Date(b?.createdAt || 0).getTime();

            if (sortOrder === "Oldest First") {

                return dateA - dateB;

            }

            return dateB - dateA;

        });


        return result;

    }, [
        complaints,
        search,
        statusFilter,
        sortOrder
    ]);


    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const resetFilters = () => {

        setSearch("");

        setStatusFilter("All");

        setSortOrder("Newest First");

    };


    /* =====================================================
       SORT CHANGE
    ===================================================== */

    const handleSortChange = (value) => {

        setSortOrder(value);

        setSortOpen(false);

    };


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = () => {

        fetchComplaints(true);

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="citizen-dashboard loading-dashboard">

                <div className="loading-box">

                    <div className="loading-spinner"></div>

                    <h3>
                        Loading your dashboard...
                    </h3>

                    <p>
                        Fetching your latest complaints
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       MAIN DASHBOARD
    ===================================================== */

    return (

        <div className="citizen-dashboard">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="dashboard-hero">

                <div className="hero-content">

                    <div className="hero-text">

                        <span className="hero-label">
                            SMART CITY CITIZEN PORTAL
                        </span>

                        <h1>
                            Welcome Back,
                            <span> Citizen!</span>
                        </h1>

                        <p>
                            Track your reported civic issues,
                            monitor their progress, and help
                            make your community better.
                        </p>


                        <div className="hero-actions">

                            <Link
                                to="/create-complaint"
                                className="primary-action"
                            >
                                <span>＋</span>
                                Report an Issue
                            </Link>


                            <button
                                className="refresh-button"
                                onClick={handleRefresh}
                                disabled={refreshing}
                            >

                                <span
                                    className={
                                        refreshing
                                            ? "spinning"
                                            : ""
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


                        <div className="hero-highlights">

                            <div className="hero-highlight">

                                <span className="highlight-icon">
                                    🛡️
                                </span>

                                <div>

                                    <strong>
                                        Secure Reports
                                    </strong>

                                    <small>
                                        Your reports are protected
                                    </small>

                                </div>

                            </div>


                            <div className="hero-highlight">

                                <span className="highlight-icon">
                                    ⚡
                                </span>

                                <div>

                                    <strong>
                                        Quick Updates
                                    </strong>

                                    <small>
                                        Stay updated on progress
                                    </small>

                                </div>

                            </div>


                            <div className="hero-highlight">

                                <span className="highlight-icon">
                                    🌆
                                </span>

                                <div>

                                    <strong>
                                        Better City
                                    </strong>

                                    <small>
                                        Together we improve
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* SMART CITY PANEL */}

                    <div className="smart-city-panel">

                        <div className="city-glow"></div>

                        <div className="city-icon">
                            🌆
                        </div>

                        <span className="city-panel-label">
                            CIVICCONNECT
                        </span>

                        <h3>
                            Smarter City
                        </h3>

                        <p>
                            Every report contributes to
                            a cleaner, safer and better city.
                        </p>


                        <div className="city-mini-stats">

                            <div>
                                <strong>
                                    {total}
                                </strong>

                                <span>
                                    Reports
                                </span>
                            </div>


                            <div>
                                <strong>
                                    {resolved}
                                </strong>

                                <span>
                                    Resolved
                                </span>
                            </div>


                            <div>
                                <strong>
                                    {improvement}%
                                </strong>

                                <span>
                                    Impact
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="stats-grid">

                <div className="stat-card total-card">

                    <div className="stat-icon">
                        📋
                    </div>

                    <div className="stat-info">

                        <span>
                            Total Reports
                        </span>

                        <strong>
                            {total}
                        </strong>

                        <small>
                            All submitted complaints
                        </small>

                    </div>

                </div>


                <div className="stat-card pending-card">

                    <div className="stat-icon">
                        ⏳
                    </div>

                    <div className="stat-info">

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pending}
                        </strong>

                        <small>
                            Waiting for action
                        </small>

                    </div>

                </div>


                <div className="stat-card progress-card">

                    <div className="stat-icon">
                        🔄
                    </div>

                    <div className="stat-info">

                        <span>
                            In Progress
                        </span>

                        <strong>
                            {progress}
                        </strong>

                        <small>
                            Currently being handled
                        </small>

                    </div>

                </div>


                <div className="stat-card resolved-card">

                    <div className="stat-icon">
                        ✅
                    </div>

                    <div className="stat-info">

                        <span>
                            Resolved
                        </span>

                        <strong>
                            {resolved}
                        </strong>

                        <small>
                            Successfully completed
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
                COMMUNITY IMPACT
            ================================================= */}

            <section className="impact-section">

                <div className="impact-left">

                    <div className="impact-icon">
                        🌱
                    </div>

                    <div>

                        <span className="section-eyebrow">
                            COMMUNITY IMPACT
                        </span>

                        <h2>
                            Your reports make a difference
                        </h2>

                        <p>
                            Together, citizens and authorities
                            can build a better city.
                        </p>

                    </div>

                </div>


                <div className="impact-progress">

                    <div className="impact-progress-top">

                        <span>
                            Resolution progress
                        </span>

                        <strong>
                            {improvement}%
                        </strong>

                    </div>


                    <div className="progress-track">

                        <div
                            className="progress-fill"
                            style={{
                                width: `${improvement}%`
                            }}
                        ></div>

                    </div>

                    <small>
                        Based on your resolved complaints
                    </small>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="dashboard-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <div>

                        <strong>
                            Something went wrong
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                    <button onClick={() => fetchComplaints()}>
                        Try Again
                    </button>

                </div>

            )}


            {/* =================================================
                COMPLAINTS
            ================================================= */}

            <section className="complaints-section">


                {/* HEADER */}

                <div className="complaints-header">

                    <div>

                        <span className="section-eyebrow">
                            MY REPORTS
                        </span>

                        <h2>
                            Your Complaints
                        </h2>

                        <p>
                            Track and manage the civic issues
                            you have reported.
                        </p>

                    </div>


                    <Link
                        to="/create-complaint"
                        className="desktop-report-btn"
                    >
                        ＋ Report New Issue
                    </Link>

                </div>


                {/* =================================================
                    SEARCH + FILTERS
                ================================================= */}

                <div className="complaint-controls">


                    {/* SEARCH */}

                    <div className="search-box">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search your complaints by title, category, or location..."
                            aria-label="Search your complaints"
                        />


                        {search && (

                            <button
                                className="clear-search"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                ×
                            </button>

                        )}

                    </div>


                    {/* FILTERS */}

                    <div className="filter-buttons">


                        <button
                            className={`filter-btn all-filter ${
                                statusFilter === "All"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setStatusFilter("All")
                            }
                        >

                            <span className="filter-icon">
                                ▦
                            </span>

                            <span>
                                All
                            </span>

                            <b>
                                {total}
                            </b>

                        </button>


                        <button
                            className={`filter-btn pending-filter ${
                                statusFilter === "Pending"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setStatusFilter("Pending")
                            }
                        >

                            <span className="filter-icon">
                                ⌛
                            </span>

                            <span>
                                Pending
                            </span>

                            <b>
                                {pending}
                            </b>

                        </button>


                        <button
                            className={`filter-btn progress-filter ${
                                statusFilter === "In Progress"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setStatusFilter("In Progress")
                            }
                        >

                            <span className="filter-icon">
                                ◔
                            </span>

                            <span>
                                In Progress
                            </span>

                            <b>
                                {progress}
                            </b>

                        </button>


                        <button
                            className={`filter-btn resolved-filter ${
                                statusFilter === "Resolved"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setStatusFilter("Resolved")
                            }
                        >

                            <span className="filter-icon">
                                ✓
                            </span>

                            <span>
                                Resolved
                            </span>

                            <b>
                                {resolved}
                            </b>

                        </button>

                    </div>

                </div>


                {/* =================================================
                    RESULTS + SORT
                ================================================= */}

                <div className="results-toolbar">

                    <div className="results-info">

                        <span>
                            Showing{" "}
                            <strong>
                                {filteredComplaints.length}
                            </strong>{" "}
                            {filteredComplaints.length === 1
                                ? "complaint"
                                : "complaints"
                            }
                        </span>


                        {(search ||
                            statusFilter !== "All") && (

                            <button
                                className="reset-filters"
                                onClick={resetFilters}
                            >
                                Reset filters
                            </button>

                        )}

                    </div>


                    {/* ATTRACTIVE SORT CONTROL */}

                    <div
                        className="sort-control"
                        ref={sortRef}
                    >

                        <span className="sort-label">
                            Sort by
                        </span>


                        <div className="sort-dropdown">

                            <button
                                type="button"
                                className={`sort-trigger ${
                                    sortOpen
                                        ? "open"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSortOpen(!sortOpen)
                                }
                                aria-haspopup="listbox"
                                aria-expanded={sortOpen}
                            >

                                <span className="sort-trigger-icon">
                                    ◷
                                </span>

                                <span className="sort-current">
                                    {sortOrder}
                                </span>

                                <span
                                    className={`sort-chevron ${
                                        sortOpen
                                            ? "rotated"
                                            : ""
                                    }`}
                                >
                                    ⌄
                                </span>

                            </button>


                            {sortOpen && (

                                <div
                                    className="sort-menu"
                                    role="listbox"
                                >

                                    <button
                                        type="button"
                                        className={`sort-option ${
                                            sortOrder ===
                                            "Newest First"
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSortChange(
                                                "Newest First"
                                            )
                                        }
                                    >

                                        <span className="sort-option-icon">
                                            ↓
                                        </span>

                                        <span>
                                            <strong>
                                                Newest First
                                            </strong>

                                            <small>
                                                Latest reports first
                                            </small>
                                        </span>

                                        {sortOrder ===
                                            "Newest First" && (

                                            <span className="sort-check">
                                                ✓
                                            </span>

                                        )}

                                    </button>


                                    <button
                                        type="button"
                                        className={`sort-option ${
                                            sortOrder ===
                                            "Oldest First"
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSortChange(
                                                "Oldest First"
                                            )
                                        }
                                    >

                                        <span className="sort-option-icon">
                                            ↑
                                        </span>

                                        <span>
                                            <strong>
                                                Oldest First
                                            </strong>

                                            <small>
                                                Earlier reports first
                                            </small>
                                        </span>

                                        {sortOrder ===
                                            "Oldest First" && (

                                            <span className="sort-check">
                                                ✓
                                            </span>

                                        )}

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    COMPLAINT GRID
                ================================================= */}

                {filteredComplaints.length > 0 ? (

                    <div className="complaints-grid">

                        {filteredComplaints.map(
                            (complaint) => (

                                <ComplaintCard
                                    key={complaint?._id}
                                    complaint={complaint}
                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🔎
                        </div>

                        <h3>
                            No complaints found
                        </h3>

                        <p>
                            We couldn't find any complaints
                            matching your search or selected
                            filter.
                        </p>

                        <button
                            className="empty-action"
                            onClick={resetFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                )}

            </section>


            {/* =================================================
                FLOATING BUTTON
            ================================================= */}

            <Link
                to="/create-complaint"
                className="floating-create"
            >

                <span>
                    ＋
                </span>

                <small>
                    Report Issue
                </small>

            </Link>

        </div>

    );

}


export default CitizenDashboard;