import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    AuthContext
} from "../context/AuthContext";

import API from "../api/axios";

import "./Navbar.css";


function Navbar() {


    const {
        user,
        logout
    } = useContext(AuthContext);


    const navigate = useNavigate();

    const notificationRef = useRef();


    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    const [mobileMenu, setMobileMenu] = useState(false);

    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const [showLogoutModal, setShowLogoutModal] = useState(false);


    const currentUser =
        user ||
        JSON.parse(localStorage.getItem("user"));


    // =====================================================
    // FETCH NOTIFICATIONS
    // =====================================================

    const fetchNotifications = async () => {

        try {

            if (!currentUser) {
                return;
            }


            setLoadingNotifications(true);


            const response = await API.get(
                "/notifications"
            );


            let data = [];


            if (
                Array.isArray(
                    response.data?.notifications
                )
            ) {

                data =
                    response.data.notifications;

            }

            else if (
                Array.isArray(
                    response.data
                )
            ) {

                data =
                    response.data;

            }


            setNotifications(data);

        }

        catch (error) {

            console.log(
                "Notification Error:",
                error
            );

            setNotifications([]);

        }

        finally {

            setLoadingNotifications(false);

        }

    };


    // =====================================================
    // NOTIFICATION AUTO REFRESH
    // =====================================================

    useEffect(() => {

        if (!currentUser) {
            return;
        }


        fetchNotifications();


        const interval = setInterval(
            () => {
                fetchNotifications();
            },
            10000
        );


        return () => {

            clearInterval(interval);

        };

    }, [currentUser]);


    // =====================================================
    // CLOSE NOTIFICATION DROPDOWN
    // =====================================================

    useEffect(() => {

        const closeDropdown = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {

                setShowNotifications(false);

            }

        };


        document.addEventListener(
            "mousedown",
            closeDropdown
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                closeDropdown
            );

        };

    }, []);


    // =====================================================
    // CLOSE LOGOUT MODAL WITH ESC KEY
    // =====================================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (
                event.key === "Escape"
            ) {

                setShowLogoutModal(false);

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    // =====================================================
    // OPEN NOTIFICATION
    // =====================================================

    const openNotification = async (
        notification
    ) => {

        try {

            if (!notification.isRead) {

                await API.put(
                    `/notifications/read/${notification._id}`
                );

            }


            setNotifications(prev =>
                prev.map(item =>
                    item._id === notification._id
                        ? {
                            ...item,
                            isRead: true
                        }
                        : item
                )
            );


            const complaintId =
                notification.complaint?._id ||
                notification.complaint;


            if (complaintId) {

                if (
                    currentUser.role === "admin"
                ) {

                    navigate(
                        `/complaint/${complaintId}`
                    );

                }

                else {

                    navigate(
                        `/citizen-complaint/${complaintId}`
                    );

                }

            }


            setShowNotifications(false);

            setMobileMenu(false);

        }

        catch (error) {

            console.log(
                "Notification Open Error:",
                error
            );

        }

    };


    // =====================================================
    // MARK ALL READ
    // =====================================================

    const markAllRead = async () => {

        try {

            if (unreadCount === 0) {
                return;
            }


            await API.put(
                "/notifications/read-all"
            );


            setNotifications(prev =>
                prev.map(item => ({
                    ...item,
                    isRead: true
                }))
            );

        }

        catch (error) {

            console.log(
                "Mark All Read Error:",
                error
            );

        }

    };


    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    const deleteNotification = async (
        id
    ) => {

        try {

            await API.delete(
                `/notifications/${id}`
            );


            setNotifications(prev =>
                prev.filter(
                    item =>
                        item._id !== id
                )
            );

        }

        catch (error) {

            console.log(
                "Delete Notification Error:",
                error
            );

        }

    };


    // =====================================================
    // OPEN LOGOUT POPUP
    // =====================================================

    const handleLogout = () => {

        setShowNotifications(false);

        setMobileMenu(false);

        setShowLogoutModal(true);

    };


    // =====================================================
    // CANCEL LOGOUT
    // =====================================================

    const cancelLogout = () => {

        setShowLogoutModal(false);

    };


    // =====================================================
    // CONFIRM LOGOUT
    // =====================================================

    const confirmLogout = () => {

        setShowLogoutModal(false);


        logout();

        localStorage.removeItem("token");

        localStorage.removeItem("user");


        setNotifications([]);

        setMobileMenu(false);

        setShowNotifications(false);


        navigate("/login");

    };


    // =====================================================
    // CLOSE MODAL WHEN CLICKING BACKGROUND
    // =====================================================

    const handleModalBackgroundClick = (
        event
    ) => {

        if (
            event.target === event.currentTarget
        ) {

            setShowLogoutModal(false);

        }

    };


    // =====================================================
    // UNREAD COUNT
    // =====================================================

    const unreadCount =
        notifications.filter(
            item =>
                item.isRead === false
        ).length;


    // =====================================================
    // CLOSE MOBILE MENU
    // =====================================================

    const closeMobileMenu = () => {

        setMobileMenu(false);

        setShowNotifications(false);

    };


    // =====================================================
    // FORMAT NOTIFICATION DATE
    // =====================================================

    const formatNotificationDate = (
        createdAt
    ) => {

        if (!createdAt) {
            return "Just now";
        }


        const date =
            new Date(createdAt);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Just now";

        }


        const now =
            new Date();


        const difference =
            now.getTime() -
            date.getTime();


        const minutes =
            Math.floor(
                difference /
                (1000 * 60)
            );


        const hours =
            Math.floor(
                difference /
                (1000 * 60 * 60)
            );


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        if (minutes < 1) {
            return "Just now";
        }


        if (minutes < 60) {
            return `${minutes} min ago`;
        }


        if (hours < 24) {
            return `${hours} hr ago`;
        }


        if (days === 1) {
            return "Yesterday";
        }


        if (days < 7) {
            return `${days} days ago`;
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


    // =====================================================
    // NOTIFICATION ICON
    // =====================================================

    const getNotificationIcon = (
        notification
    ) => {

        const message =
            notification?.message
                ?.toLowerCase() || "";


        if (
            message.includes("resolved") ||
            message.includes("resolve")
        ) {

            return "✅";

        }


        if (
            message.includes("progress") ||
            message.includes("working")
        ) {

            return "🔄";

        }


        if (
            message.includes("pending") ||
            message.includes("submitted")
        ) {

            return "📋";

        }


        if (
            message.includes("reject") ||
            message.includes("rejected")
        ) {

            return "⚠️";

        }


        return "🔔";

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <>

            <nav className="navbar">


                {/* =================================================
                    LEFT SIDE / LOGO
                ================================================= */}

                <div className="navbar-left">


                    <Link
                        to="/"
                        className="logo"
                        onClick={closeMobileMenu}
                    >

                        <div className="logo-icon">
                            🌍
                        </div>


                        <div className="logo-text">

                            <strong>
                                CivicConnect
                            </strong>

                            <span>
                                SMART CITY PORTAL
                            </span>

                        </div>

                    </Link>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        className={
                            mobileMenu
                                ? "menu-btn active"
                                : "menu-btn"
                        }
                        onClick={() =>
                            setMobileMenu(
                                !mobileMenu
                            )
                        }
                        aria-label="Toggle menu"
                        aria-expanded={
                            mobileMenu
                        }
                    >

                        {mobileMenu
                            ? "✕"
                            : "☰"
                        }

                    </button>


                </div>



                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <div
                    className={
                        mobileMenu
                            ? "nav-links active"
                            : "nav-links"
                    }
                >


                    {/* HOME */}

                    <Link
                        to="/"
                        className="nav-item"
                        onClick={closeMobileMenu}
                    >

                        <span className="nav-icon">
                            🏠
                        </span>

                        <span>
                            Home
                        </span>

                    </Link>



                    {/* =================================================
                        GUEST LINKS
                    ================================================= */}

                    {!currentUser && (

                        <>

                            <Link
                                to="/login"
                                className="nav-item"
                                onClick={closeMobileMenu}
                            >

                                <span className="nav-icon">
                                    🔐
                                </span>

                                <span>
                                    Login
                                </span>

                            </Link>


                            <Link
                                to="/register"
                                className="nav-item"
                                onClick={closeMobileMenu}
                            >

                                <span className="nav-icon">
                                    📝
                                </span>

                                <span>
                                    Register
                                </span>

                            </Link>

                        </>

                    )}



                    {/* =================================================
                        LOGGED IN USER
                    ================================================= */}

                    {currentUser && (

                        <>


                            {/* WELCOME */}

                            <div className="welcome-card">

                                <div className="welcome-avatar">
                                    👋
                                </div>


                                <div className="welcome-content">

                                    <span>
                                        Welcome
                                    </span>

                                    <strong>
                                        {currentUser.name}
                                    </strong>

                                </div>

                            </div>



                            {/* DASHBOARD */}

                            <Link
                                to={
                                    currentUser.role === "admin"
                                        ? "/admin-dashboard"
                                        : "/citizen-dashboard"
                                }
                                className="nav-item"
                                onClick={closeMobileMenu}
                            >

                                <span className="nav-icon">
                                    📊
                                </span>

                                <span>
                                    Dashboard
                                </span>

                            </Link>



                            {/* CREATE COMPLAINT */}

                            {currentUser.role === "citizen" && (

                                <Link
                                    to="/create-complaint"
                                    className="nav-item create-nav-item"
                                    onClick={closeMobileMenu}
                                >

                                    <span className="nav-icon">
                                        ＋
                                    </span>

                                    <span>
                                        Create Complaint
                                    </span>

                                </Link>

                            )}



                            {/* PROFILE */}

                            <Link
                                to="/profile"
                                className="nav-item"
                                onClick={closeMobileMenu}
                            >

                                <span className="nav-icon">
                                    👤
                                </span>

                                <span>
                                    Profile
                                </span>

                            </Link>



                            {/* =================================================
                                NOTIFICATIONS
                            ================================================= */}

                            <div
                                className="notification-container"
                                ref={notificationRef}
                            >


                                <button
                                    className={
                                        unreadCount > 0
                                            ? "notification-btn has-unread"
                                            : "notification-btn"
                                    }
                                    onClick={() =>
                                        setShowNotifications(
                                            !showNotifications
                                        )
                                    }
                                    aria-label="Notifications"
                                    aria-expanded={
                                        showNotifications
                                    }
                                >

                                    <span className="notification-icon">
                                        🔔
                                    </span>


                                    {unreadCount > 0 && (

                                        <span className="notification-count">

                                            {unreadCount > 99
                                                ? "99+"
                                                : unreadCount
                                            }

                                        </span>

                                    )}

                                </button>



                                {/* NOTIFICATION DROPDOWN */}

                                {showNotifications && (

                                    <div className="notification-dropdown">


                                        {/* HEADER */}

                                        <div className="notification-header">


                                            <div className="notification-title-area">

                                                <div className="notification-header-icon">
                                                    🔔
                                                </div>

                                                <div>

                                                    <h3>
                                                        Notifications
                                                    </h3>

                                                    <span>

                                                        {unreadCount > 0
                                                            ? `${unreadCount} new ${
                                                                unreadCount === 1
                                                                    ? "notification"
                                                                    : "notifications"
                                                            }`
                                                            : "You're all caught up"
                                                        }

                                                    </span>

                                                </div>

                                            </div>


                                            {unreadCount > 0 && (

                                                <button
                                                    className="mark-all-btn"
                                                    onClick={
                                                        markAllRead
                                                    }
                                                >

                                                    ✓ Mark all

                                                </button>

                                            )}

                                        </div>



                                        {/* CONTENT */}

                                        {loadingNotifications ? (

                                            <div className="notification-loading">

                                                <div className="notification-loading-icon">
                                                    🔔
                                                </div>

                                                <div className="notification-spinner"></div>

                                                <strong>
                                                    Loading notifications
                                                </strong>

                                                <span>
                                                    Checking for new activity...
                                                </span>

                                            </div>

                                        ) : notifications.length === 0 ? (

                                            <div className="empty-notification">

                                                <div className="empty-notification-icon">
                                                    🔕
                                                </div>

                                                <h4>
                                                    All caught up!
                                                </h4>

                                                <p>
                                                    You don't have any new notifications right now.
                                                </p>

                                                <span>
                                                    We'll let you know when something changes.
                                                </span>

                                            </div>

                                        ) : (

                                            <div className="notification-list">

                                                {notifications.map(
                                                    notification => (

                                                        <div
                                                            key={
                                                                notification._id
                                                            }
                                                            className={
                                                                notification.isRead
                                                                    ? "notification-item read"
                                                                    : "notification-item unread"
                                                            }
                                                        >


                                                            <button
                                                                className="notification-message"
                                                                onClick={() =>
                                                                    openNotification(
                                                                        notification
                                                                    )
                                                                }
                                                            >

                                                                <div className="notification-item-icon">

                                                                    {
                                                                        getNotificationIcon(
                                                                            notification
                                                                        )
                                                                    }

                                                                </div>


                                                                <div className="notification-item-content">

                                                                    <div className="notification-item-top">

                                                                        <span className="notification-label">

                                                                            {
                                                                                notification.isRead
                                                                                    ? "Notification"
                                                                                    : "NEW"
                                                                            }

                                                                        </span>

                                                                        {!notification.isRead && (

                                                                            <span className="unread-indicator">
                                                                                New
                                                                            </span>

                                                                        )}

                                                                    </div>


                                                                    <p>

                                                                        {
                                                                            notification.message ||
                                                                            "You have a new CivicConnect notification."
                                                                        }

                                                                    </p>


                                                                    <span className="notification-time">

                                                                        <span>
                                                                            🕐
                                                                        </span>

                                                                        {
                                                                            formatNotificationDate(
                                                                                notification.createdAt
                                                                            )
                                                                        }

                                                                    </span>

                                                                </div>

                                                            </button>



                                                            {/* DELETE */}

                                                            <button
                                                                className="delete-notification"
                                                                onClick={() =>
                                                                    deleteNotification(
                                                                        notification._id
                                                                    )
                                                                }
                                                                aria-label="Delete notification"
                                                                title="Delete notification"
                                                            >

                                                                ✕

                                                            </button>


                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}


                                        {/* FOOTER */}

                                        {notifications.length > 0 && (

                                            <div className="notification-footer">

                                                <span>
                                                    🔄 Updates automatically
                                                </span>

                                                <span>
                                                    Every 10 seconds
                                                </span>

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>



                            {/* LOGOUT */}

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >

                                <span>
                                    🚪
                                </span>

                                <strong>
                                    Logout
                                </strong>

                            </button>


                        </>

                    )}

                </div>

            </nav>



            {/* =================================================
                PREMIUM LOGOUT MODAL
            ================================================= */}

            {showLogoutModal && (

                <div
                    className="logout-modal-overlay"
                    onClick={
                        handleModalBackgroundClick
                    }
                >

                    <div
                        className="logout-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="logout-modal-title"
                    >


                        {/* CLOSE BUTTON */}

                        <button
                            className="logout-modal-close"
                            onClick={cancelLogout}
                            aria-label="Close logout popup"
                        >

                            ✕

                        </button>



                        {/* ICON */}

                        <div className="logout-modal-icon">

                            🚪

                        </div>



                        {/* BRAND */}

                        <div className="logout-modal-brand">

                            CIVICCONNECT

                        </div>



                        {/* TITLE */}

                        <h2
                            id="logout-modal-title"
                        >

                            Ready to leave?

                        </h2>



                        {/* DESCRIPTION */}

                        <p className="logout-modal-description">

                            Are you sure you want to logout from your
                            <br />
                            CivicConnect account?

                        </p>



                        {/* USER */}

                        <div className="logout-user-card">

                            <div className="logout-user-avatar">

                                👤

                            </div>


                            <div className="logout-user-info">

                                <span>
                                    Signed in as
                                </span>

                                <strong>
                                    {currentUser?.name || "User"}
                                </strong>

                            </div>

                        </div>



                        {/* BUTTONS */}

                        <div className="logout-modal-actions">


                            <button
                                className="stay-logged-btn"
                                onClick={cancelLogout}
                            >

                                <span>
                                    ←
                                </span>

                                Stay Logged In

                            </button>



                            <button
                                className="confirm-logout-btn"
                                onClick={confirmLogout}
                            >

                                <span>
                                    🚪
                                </span>

                                Logout

                            </button>


                        </div>



                        {/* SECURITY MESSAGE */}

                        <div className="logout-security">

                            <span>
                                🔒
                            </span>

                            <p>
                                Your session will be securely ended.
                            </p>

                        </div>


                    </div>

                </div>

            )}

        </>

    );

}


export default Navbar;