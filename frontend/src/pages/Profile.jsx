import "./Profile.css";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import API from "../api/axios";

import {
    toast
} from "react-toastify";


function Profile() {

    const navigate = useNavigate();


    // ======================================================
    // STATE
    // ======================================================

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");


    // ======================================================
    // EDIT PROFILE STATE
    // ======================================================

    const [showEdit, setShowEdit] = useState(false);

    const [saving, setSaving] = useState(false);

    const [editForm, setEditForm] = useState({

        name: "",

        mobile: ""

    });


    // ======================================================
    // FETCH PROFILE
    // ======================================================

    const fetchProfile = async () => {

        try {

            setError("");

            const response =
                await API.get("/profile");


            setProfile(response.data);


        } catch (error) {

            console.log(
                "PROFILE FETCH ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load profile"
            );

        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // ======================================================
    // REFRESH
    // ======================================================

    const refreshProfile = () => {

        setRefreshing(true);

        fetchProfile();

    };


    // ======================================================
    // OPEN EDIT PROFILE
    // ======================================================

    const openEditProfile = () => {

        setEditForm({

            name: profile?.name || "",

            mobile: profile?.mobile || ""

        });

        setShowEdit(true);

    };


    // ======================================================
    // CLOSE EDIT PROFILE
    // ======================================================

    const closeEditProfile = () => {

        if (saving) {
            return;
        }

        setShowEdit(false);

    };


    // ======================================================
    // HANDLE EDIT INPUT
    // ======================================================

    const handleEditChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setEditForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    // ======================================================
    // UPDATE PROFILE
    // ======================================================

    const handleUpdateProfile = async (event) => {

        event.preventDefault();


        // ==================================================
        // NAME VALIDATION
        // ==================================================

        if (!editForm.name.trim()) {

            toast.error(
                "Name cannot be empty"
            );

            return;

        }


        // ==================================================
        // MOBILE VALIDATION
        // ==================================================

        if (
            editForm.mobile &&
            !/^[0-9]{10}$/.test(
                editForm.mobile.trim()
            )
        ) {

            toast.error(
                "Enter a valid 10-digit mobile number"
            );

            return;

        }


        try {

            setSaving(true);


            const response =
                await API.put(
                    "/profile",
                    {

                        name:
                            editForm.name.trim(),

                        mobile:
                            editForm.mobile.trim()

                    }
                );


            // ==================================================
            // UPDATED USER
            // ==================================================

            const updatedUser =
                response.data.user;


            // ==================================================
            // UPDATE PROFILE SCREEN
            // ==================================================

            setProfile(prev => ({

                ...prev,

                ...updatedUser

            }));


            // ==================================================
            // UPDATE LOCAL STORAGE USER
            // ==================================================

            const savedUser =
                localStorage.getItem("user");


            if (savedUser) {

                try {

                    const user =
                        JSON.parse(savedUser);


                    localStorage.setItem(
                        "user",
                        JSON.stringify({

                            ...user,

                            name:
                                updatedUser.name,

                            mobile:
                                updatedUser.mobile

                        })
                    );

                } catch (storageError) {

                    console.log(
                        "LOCAL STORAGE UPDATE ERROR:",
                        storageError
                    );

                }

            }


            // ==================================================
            // CLOSE MODAL
            // ==================================================

            setShowEdit(false);


            toast.success(
                "Profile updated successfully!"
            );


        } catch (error) {

            console.log(
                "PROFILE UPDATE ERROR:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // ======================================================
    // LOGOUT
    // ======================================================

    const logout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        navigate("/login");

    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div className="profile-loading">

                <div className="profile-loading-card">

                    <div className="profile-spinner">
                    </div>

                    <h2>
                        Loading Profile...
                    </h2>

                    <p>
                        Please wait while we fetch
                        your information.
                    </p>

                </div>

            </div>

        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {

        return (

            <div className="profile-error">

                <div className="profile-error-card">

                    <div className="profile-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Profile
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchProfile}
                        className="profile-retry-btn"
                    >
                        🔄 Try Again
                    </button>

                </div>

            </div>

        );

    }


    if (!profile) {
        return null;
    }


    // ======================================================
    // PROFILE DATA
    // ======================================================

    const isAdmin =
        profile.role === "admin";


    const total =
        profile.totalComplaints || 0;


    const pending =
        profile.pending || 0;


    const inProgress =
        profile.inProgress || 0;


    const resolved =
        profile.resolved || 0;


    const resolutionRate =
        total > 0
            ? Math.round(
                (resolved / total) * 100
            )
            : 0;


    const joinedDate =
        profile.createdAt
            ? new Date(
                profile.createdAt
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )
            : "Not available";


    return (

        <div className="profile-page">


            {/* ==================================================
                TOP BAR
            ================================================== */}

            <div className="profile-topbar">

                <div
                    className="profile-brand"
                    onClick={() => navigate("/")}
                >

                    <div className="profile-brand-icon">
                        🏙️
                    </div>

                    <div>

                        <h2>
                            CivicConnect
                        </h2>

                        <span>
                            Smart City Platform
                        </span>

                    </div>

                </div>


                <button
                    className="profile-dashboard-btn"
                    onClick={() =>
                        navigate(
                            isAdmin
                                ? "/admin-dashboard"
                                : "/citizen-dashboard"
                        )
                    }
                >
                    📊 Dashboard
                </button>

            </div>



            {/* ==================================================
                HERO
            ================================================== */}

            <section className="profile-hero">

                <div className="profile-hero-left">

                    <div className="profile-avatar">

                        {profile.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}

                    </div>


                    <div className="profile-hero-info">

                        <div className="profile-role-badge">

                            {isAdmin
                                ? "🛡️ Administrator"
                                : "👤 Citizen"}

                        </div>

                        <h1>
                            {profile.name}
                        </h1>

                        <p>
                            {profile.email}
                        </p>

                        <span className="profile-active-status">
                            ● Active Account
                        </span>

                    </div>

                </div>


                <button
                    className="profile-refresh-btn"
                    onClick={refreshProfile}
                    disabled={refreshing}
                >

                    {refreshing
                        ? "⏳ Refreshing..."
                        : "🔄 Refresh"}

                </button>

            </section>



            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

            <section className="profile-section">

                <div className="profile-section-heading">

                    <div>

                        <span className="section-eyebrow">
                            ACCOUNT
                        </span>

                        <h2>
                            Personal Information
                        </h2>

                        <p>
                            Your registered account details
                        </p>

                    </div>

                </div>


                <div className="profile-info-grid">


                    {/* NAME */}

                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            👤
                        </div>

                        <div>

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {profile.name || "Not available"}
                            </strong>

                        </div>

                    </div>



                    {/* EMAIL */}

                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            ✉️
                        </div>

                        <div>

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {profile.email || "Not available"}
                            </strong>

                        </div>

                    </div>



                    {/* MOBILE */}

                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            📱
                        </div>

                        <div>

                            <span>
                                Mobile Number
                            </span>

                            <strong>
                                {profile.mobile || "Not added"}
                            </strong>

                        </div>

                    </div>



                    {/* ROLE */}

                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            🛡️
                        </div>

                        <div>

                            <span>
                                Account Type
                            </span>

                            <strong>
                                {isAdmin
                                    ? "Administrator"
                                    : "Citizen"}
                            </strong>

                        </div>

                    </div>



                    {/* JOINED */}

                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            📅
                        </div>

                        <div>

                            <span>
                                Joined CivicConnect
                            </span>

                            <strong>
                                {joinedDate}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>



            {/* ==================================================
                COMPLAINT STATISTICS
            ================================================== */}

            <section className="profile-section">

                <div className="profile-section-heading">

                    <div>

                        <span className="section-eyebrow">
                            ACTIVITY
                        </span>

                        <h2>
                            Complaint Statistics
                        </h2>

                        <p>
                            Overview of complaint activity
                        </p>

                    </div>

                </div>


                <div className="profile-stats-grid">


                    <div className="profile-stat-card total">

                        <div className="profile-stat-icon">
                            📋
                        </div>

                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                {total}
                            </strong>

                        </div>

                    </div>


                    <div className="profile-stat-card pending">

                        <div className="profile-stat-icon">
                            ⏳
                        </div>

                        <div>

                            <span>
                                Pending
                            </span>

                            <strong>
                                {pending}
                            </strong>

                        </div>

                    </div>


                    <div className="profile-stat-card progress">

                        <div className="profile-stat-icon">
                            🔄
                        </div>

                        <div>

                            <span>
                                In Progress
                            </span>

                            <strong>
                                {inProgress}
                            </strong>

                        </div>

                    </div>


                    <div className="profile-stat-card resolved">

                        <div className="profile-stat-icon">
                            ✅
                        </div>

                        <div>

                            <span>
                                Resolved
                            </span>

                            <strong>
                                {resolved}
                            </strong>

                        </div>

                    </div>

                </div>



                {/* RESOLUTION RATE */}

                <div className="profile-resolution-card">

                    <div className="resolution-top">

                        <div>

                            <span>
                                Resolution Rate
                            </span>

                            <h3>
                                {resolutionRate}%
                            </h3>

                        </div>

                        <div className="resolution-icon">
                            🎯
                        </div>

                    </div>


                    <div className="resolution-bar">

                        <div
                            className="resolution-fill"
                            style={{
                                width:
                                    `${resolutionRate}%`
                            }}
                        >
                        </div>

                    </div>

                    <p>
                        {resolved} of {total} complaints
                        resolved
                    </p>

                </div>

            </section>



            {/* ==================================================
                QUICK ACTIONS
            ================================================== */}

            <section className="profile-section">

                <div className="profile-section-heading">

                    <div>

                        <span className="section-eyebrow">
                            QUICK ACTIONS
                        </span>

                        <h2>
                            Manage Your Account
                        </h2>

                    </div>

                </div>


                <div className="profile-actions">


                    <button
                        className="profile-action-btn dashboard"
                        onClick={() =>
                            navigate(
                                isAdmin
                                    ? "/admin-dashboard"
                                    : "/citizen-dashboard"
                            )
                        }
                    >

                        <span>
                            📊
                        </span>

                        <div>

                            <strong>
                                Dashboard
                            </strong>

                            <small>
                                View your activity
                            </small>

                        </div>

                    </button>



                    <button
                        className="profile-action-btn edit"
                        onClick={openEditProfile}
                    >

                        <span>
                            ✏️
                        </span>

                        <div>

                            <strong>
                                Edit Profile
                            </strong>

                            <small>
                                Update your information
                            </small>

                        </div>

                    </button>



                    <button
                        className="profile-action-btn logout"
                        onClick={logout}
                    >

                        <span>
                            🚪
                        </span>

                        <div>

                            <strong>
                                Logout
                            </strong>

                            <small>
                                Sign out of CivicConnect
                            </small>

                        </div>

                    </button>

                </div>

            </section>



            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="profile-footer">

                <strong>
                    CivicConnect
                </strong>

                <span>
                    Making cities better, one complaint at a time.
                </span>

            </footer>



            {/* ==================================================
                EDIT PROFILE MODAL
            ================================================== */}

            {showEdit && (

                <div
                    className="edit-profile-overlay"
                    onMouseDown={closeEditProfile}
                >

                    <div
                        className="edit-profile-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* HEADER */}

                        <div className="edit-profile-header">

                            <div>

                                <span>
                                    ACCOUNT SETTINGS
                                </span>

                                <h2>
                                    Edit Profile
                                </h2>

                                <p>
                                    Update your personal information
                                </p>

                            </div>


                            <button
                                type="button"
                                className="edit-profile-close"
                                onClick={closeEditProfile}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>



                        {/* FORM */}

                        <form
                            className="edit-profile-form"
                            onSubmit={handleUpdateProfile}
                        >


                            {/* NAME */}

                            <div className="edit-form-group">

                                <label>
                                    Full Name
                                </label>

                                <div className="edit-input-wrapper">

                                    <span>
                                        👤
                                    </span>

                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        placeholder="Enter your full name"
                                        maxLength="80"
                                        disabled={saving}
                                    />

                                </div>

                            </div>



                            {/* MOBILE */}

                            <div className="edit-form-group">

                                <label>
                                    Mobile Number
                                </label>

                                <div className="edit-input-wrapper">

                                    <span>
                                        📱
                                    </span>

                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={editForm.mobile}
                                        onChange={handleEditChange}
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength="10"
                                        inputMode="numeric"
                                        disabled={saving}
                                    />

                                </div>

                            </div>



                            {/* EMAIL */}

                            <div className="edit-form-group">

                                <label>
                                    Email Address
                                </label>

                                <div className="edit-input-wrapper disabled">

                                    <span>
                                        ✉️
                                    </span>

                                    <input
                                        type="email"
                                        value={profile.email || ""}
                                        disabled
                                    />

                                </div>

                                <small>
                                    Email address cannot be changed.
                                </small>

                            </div>



                            {/* ROLE */}

                            <div className="edit-form-group">

                                <label>
                                    Account Type
                                </label>

                                <div className="edit-input-wrapper disabled">

                                    <span>
                                        🛡️
                                    </span>

                                    <input
                                        type="text"
                                        value={
                                            isAdmin
                                                ? "Administrator"
                                                : "Citizen"
                                        }
                                        disabled
                                    />

                                </div>

                                <small>
                                    Account type cannot be changed.
                                </small>

                            </div>



                            {/* BUTTONS */}

                            <div className="edit-profile-buttons">

                                <button
                                    type="button"
                                    className="edit-cancel-btn"
                                    onClick={closeEditProfile}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="edit-save-btn"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <span className="edit-save-spinner">
                                            </span>

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            ✓ Save Changes
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Profile;