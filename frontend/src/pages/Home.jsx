import "./Home.css";

import {
    Link
} from "react-router-dom";

import {
    useContext
} from "react";

import {
    AuthContext
} from "../context/AuthContext";

import Footer from "../components/Footer";


function Home(){

    const {
        user
    } = useContext(AuthContext);


    return(

        <div className="home">


            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="hero">


                <div className="hero-left">


                    <div className="brand-tag">

                        🏙️ Smart Digital Civic Platform

                    </div>


                    <h1>
                        CivicConnect
                    </h1>


                    <h2>
                        Digital Citizen Complaint Reporting
                        and Resolution Management System
                    </h2>


                    <p>

                        Connect citizens and authorities through
                        a smart digital platform.

                        Citizens can report public issues like road
                        damage, garbage problems, water leakage,
                        street light issues and more with images
                        and location details.

                        Authorities can monitor complaints,
                        manage priorities and provide faster
                        solutions using a centralized dashboard.

                    </p>


                    {/* =================================================
                        HERO BUTTONS
                        DIFFERENT FOR LOGGED-IN / LOGGED-OUT USERS
                    ================================================= */}

                    <div className="hero-buttons">


                        {user ? (

                            <>

                                {/* ===============================
                                    LOGGED-IN ADMIN
                                =============================== */}

                                {user.role?.toLowerCase() === "admin" ? (

                                    <Link to="/admin-dashboard">

                                        <button>

                                            📊 Go to Admin Dashboard

                                        </button>

                                    </Link>

                                ) : (

                                    /* ===============================
                                       LOGGED-IN CITIZEN
                                    =============================== */

                                    <>

                                        <Link to="/citizen-dashboard">

                                            <button>

                                                📊 Go to Dashboard

                                            </button>

                                        </Link>


                                        <Link to="/create-complaint">

                                            <button className="outline-btn">

                                                📝 Create Complaint

                                            </button>

                                        </Link>

                                    </>

                                )}

                            </>

                        ) : (

                            /* ===============================
                               NOT LOGGED-IN USER
                            =============================== */

                            <>

                                <Link to="/register">

                                    <button>

                                        Get Started 🚀

                                    </button>

                                </Link>


                                <Link to="/login">

                                    <button className="outline-btn">

                                        Login

                                    </button>

                                </Link>

                            </>

                        )}

                    </div>


                </div>


                {/* =====================================================
                    HERO RIGHT CARD
                ===================================================== */}

                <div className="hero-right">


                    <div className="ai-card">


                        <div className="icon">
                            🏙️
                        </div>


                        <h3>
                            Smart City Management
                        </h3>


                        <div className="ai-features">


                            <p>
                                📝 Digital Complaint Reporting
                            </p>


                            <p>
                                📍 Location Based Tracking
                            </p>


                            <p>
                                📊 Authority Dashboard
                            </p>


                            <p>
                                🔔 Real-Time Notifications
                            </p>


                            <p>
                                ✅ Faster Resolution
                            </p>


                        </div>


                    </div>


                </div>


            </section>


            {/* =====================================================
                FEATURES
            ===================================================== */}

            <section className="services">


                <h2>
                    Powerful Platform Features
                </h2>


                <div className="cards">


                    <div className="card">


                        <div className="feature-icon">
                            📝
                        </div>


                        <h3>
                            Smart Reporting
                        </h3>


                        <p>
                            Submit complaints with description,
                            images and location details.
                        </p>


                    </div>


                    <div className="card">


                        <div className="feature-icon">
                            📊
                        </div>


                        <h3>
                            Admin Dashboard
                        </h3>


                        <p>
                            Authorities can manage complaints
                            and monitor progress.
                        </p>


                    </div>


                    <div className="card">


                        <div className="feature-icon">
                            🔔
                        </div>


                        <h3>
                            Instant Updates
                        </h3>


                        <p>
                            Citizens receive real time updates
                            about complaint status.
                        </p>


                    </div>


                </div>


            </section>


            {/* =====================================================
                WORKFLOW
            ===================================================== */}

            <section className="workflow">


                <h2>
                    How CivicConnect Works
                </h2>


                <div className="workflow-container">


                    <div className="step">


                        <div className="step-icon">
                            👤
                        </div>


                        <h3>
                            Citizen
                        </h3>


                        <p>
                            Creates account and reports issues.
                        </p>


                    </div>


                    <div className="arrow">
                        ➜
                    </div>


                    <div className="step">


                        <div className="step-icon">
                            📤
                        </div>


                        <h3>
                            Complaint
                        </h3>


                        <p>
                            Uploads details, images and location.
                        </p>


                    </div>


                    <div className="arrow">
                        ➜
                    </div>


                    <div className="step">


                        <div className="step-icon">
                            🏢
                        </div>


                        <h3>
                            Authority
                        </h3>


                        <p>
                            Officials review complaints.
                        </p>


                    </div>


                    <div className="arrow">
                        ➜
                    </div>


                    <div className="step">


                        <div className="step-icon">
                            ✅
                        </div>


                        <h3>
                            Resolution
                        </h3>


                        <p>
                            Issues solved successfully.
                        </p>


                    </div>


                </div>


            </section>


            {/* =====================================================
                STATISTICS
            ===================================================== */}

            <section className="statistics">


                <h2>
                    Why Choose CivicConnect?
                </h2>


                <div className="stats">


                    <div className="stat-box">


                        <h3>
                            24/7
                        </h3>


                        <p>
                            Complaint Reporting
                        </p>


                    </div>


                    <div className="stat-box">


                        <h3>
                            100%
                        </h3>


                        <p>
                            Digital Process
                        </p>


                    </div>


                    <div className="stat-box">


                        <h3>
                            Fast
                        </h3>


                        <p>
                            Issue Tracking
                        </p>


                    </div>


                    <div className="stat-box">


                        <h3>
                            Secure
                        </h3>


                        <p>
                            JWT Authentication
                        </p>


                    </div>


                </div>


            </section>


            <Footer />


        </div>

    );

}


export default Home;