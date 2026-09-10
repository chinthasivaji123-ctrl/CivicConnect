import "./AdminDashboard.css";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import API from "../api/axios";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler
} from "chart.js";

import {
    Pie,
    Bar,
    Line
} from "react-chartjs-2";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler
);


function AdminDashboard(){

    const navigate = useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [complaints,setComplaints] = useState([]);

    const [loading,setLoading] = useState(true);

    const [refreshing,setRefreshing] = useState(false);

    const [error,setError] = useState("");


    /* ================= FILTERS ================= */

    const [search,setSearch] = useState("");

    const [statusFilter,setStatusFilter] = useState("All");

    const [categoryFilter,setCategoryFilter] = useState("All");

    const [priorityFilter,setPriorityFilter] = useState("All");

    const [dateFilter,setDateFilter] = useState("All");

    const [sortBy,setSortBy] = useState("newest");


    /* ================= PAGINATION ================= */

    const [currentPage,setCurrentPage] = useState(1);

    const complaintsPerPage = 6;



    /* =====================================================
       FETCH COMPLAINTS
    ===================================================== */

    const fetchComplaints = async () => {

        try{

            setError("");

            const response =
                await API.get("/complaints/all");

            const data =
                response?.data;

               console.log(
    "ADMIN COMPLAINT DATA:",
    data
); 


            if(Array.isArray(data)){

                setComplaints(data);

            }

            else if(
                Array.isArray(data?.complaints)
            ){

                setComplaints(
                    data.complaints
                );

            }

            else{

                setComplaints([]);

            }

        }

        catch(err){

            console.error(
                "FETCH COMPLAINTS ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load complaints."
            );

        }

        finally{

            setLoading(false);

            setRefreshing(false);

        }

    };


    useEffect(()=>{

        fetchComplaints();

    },[]);



    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = async () => {

        setRefreshing(true);

        await fetchComplaints();

    };



    /* =====================================================
       STATUS UPDATE
    ===================================================== */

    const updateStatus = async (
        id,
        status
    ) => {

        try{

            await API.put(
                `/complaints/status/${id}`,
                {
                    status
                }
            );


            setComplaints(
                previous =>
                    previous.map(
                        complaint => {

                            const complaintId =
                                complaint?._id ||
                                complaint?.id;


                            if(
                                String(
                                    complaintId
                                ) ===
                                String(id)
                            ){

                                return {
                                    ...complaint,
                                    status
                                };

                            }


                            return complaint;

                        }
                    )
            );

        }

        catch(err){

            console.error(
                "UPDATE STATUS ERROR:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Unable to update complaint."
            );

        }

    };



    /* =====================================================
       DELETE COMPLAINT
    ===================================================== */

    const deleteComplaint = async (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this complaint?"
            );


        if(!confirmDelete){

            return;

        }


        try{

            await API.delete(
                `/complaints/delete/${id}`
            );


            setComplaints(
                previous =>
                    previous.filter(
                        complaint => {

                            const complaintId =
                                complaint?._id ||
                                complaint?.id;


                            return (
                                String(
                                    complaintId
                                ) !==
                                String(id)
                            );

                        }
                    )
            );

        }

        catch(err){

            console.error(
                "DELETE COMPLAINT ERROR:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Unable to delete complaint."
            );

        }

    };



    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */

    const getComplaintId = (
        complaint
    ) => {

        return (
            complaint?._id ||
            complaint?.id ||
            ""
        );

    };


    const getStatus = (
        complaint
    ) => {

        return (
            complaint?.status ||
            "Pending"
        );

    };


    const getPriority = (
        complaint
    ) => {

        return (
            complaint?.priority ||
            "Normal"
        );

    };


    const getCategory = (
        complaint
    ) => {

        return (
            complaint?.category ||
            "Other"
        );

    };


    const getDate = (
        complaint
    ) => {

        if(!complaint?.createdAt){

            return null;

        }


        const date =
            new Date(
                complaint.createdAt
            );


        if(
            Number.isNaN(
                date.getTime()
            )
        ){

            return null;

        }


        return date;

    };


    const getCitizenName = (
        complaint
    ) => {

        return (
            complaint?.citizen?.name ||
            complaint?.user?.name ||
            complaint?.citizenName ||
            complaint?.name ||
            "Unknown Citizen"
        );

    };


    const getCitizenEmail = (
        complaint
    ) => {

        return (
            complaint?.citizen?.email ||
            complaint?.user?.email ||
            complaint?.citizenEmail ||
            complaint?.email ||
            "No email"
        );

    };


    const getLocation = (
        complaint
    ) => {

        return [
            complaint?.address?.street ||
            complaint?.street,

            complaint?.address?.city ||
            complaint?.city,

            complaint?.address?.district ||
            complaint?.district,

            complaint?.address?.state ||
            complaint?.state,

            complaint?.address?.pincode ||
            complaint?.pincode
        ]
        .filter(Boolean)
        .join(", ");

    };



    /* =====================================================
       DATE HELPERS
    ===================================================== */

    const startOfDay = (
        date
    ) => {

        const result =
            new Date(date);

        result.setHours(
            0,
            0,
            0,
            0
        );

        return result;

    };


    const endOfDay = (
        date
    ) => {

        const result =
            new Date(date);

        result.setHours(
            23,
            59,
            59,
            999
        );

        return result;

    };


    const startOfWeek = () => {

        const today =
            new Date();

        const day =
            today.getDay();

        const difference =
            day === 0
                ? 6
                : day - 1;


        const monday =
            new Date(today);

        monday.setDate(
            today.getDate() -
            difference
        );

        monday.setHours(
            0,
            0,
            0,
            0
        );

        return monday;

    };


    const startOfMonth = () => {

        const today =
            new Date();

        return new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

    };



    /* =====================================================
       SPECIFIC DATE MATCH
       IMPORTANT:
       This is BEFORE statistics useMemo.
    ===================================================== */

    const matchesSpecificDate = (
        complaint,
        offset
    ) => {

        const complaintDate =
            getDate(complaint);


        if(!complaintDate){

            return false;

        }


        const target =
            new Date();


        target.setDate(
            target.getDate() +
            offset
        );


        return (
            complaintDate >=
            startOfDay(target) &&

            complaintDate <=
            endOfDay(target)
        );

    };



    /* =====================================================
       DATE FILTER MATCH
    ===================================================== */

    const matchesDateFilter = (
        complaint
    ) => {

        const complaintDate =
            getDate(complaint);


        if(!complaintDate){

            return false;

        }


        const now =
            new Date();


        if(
            dateFilter === "All"
        ){

            return true;

        }


        if(
            dateFilter === "Today"
        ){

            return (
                complaintDate >=
                startOfDay(now) &&

                complaintDate <=
                endOfDay(now)
            );

        }


        if(
            dateFilter === "Yesterday"
        ){

            const yesterday =
                new Date(now);

            yesterday.setDate(
                now.getDate() - 1
            );


            return (
                complaintDate >=
                startOfDay(yesterday) &&

                complaintDate <=
                endOfDay(yesterday)
            );

        }


        if(
            dateFilter === "7days"
        ){

            const date =
                new Date(now);

            date.setDate(
                now.getDate() - 6
            );


            return (
                complaintDate >=
                startOfDay(date)
            );

        }


        if(
            dateFilter === "30days"
        ){

            const date =
                new Date(now);

            date.setDate(
                now.getDate() - 29
            );


            return (
                complaintDate >=
                startOfDay(date)
            );

        }


        if(
            dateFilter === "Week"
        ){

            return (
                complaintDate >=
                startOfWeek()
            );

        }


        if(
            dateFilter === "Month"
        ){

            return (
                complaintDate >=
                startOfMonth()
            );

        }


        return true;

    };



    /* =====================================================
       CATEGORIES
    ===================================================== */

    const categories = useMemo(()=>{

        return [
            ...new Set(
                complaints
                .map(
                    complaint =>
                        complaint?.category
                )
                .filter(Boolean)
            )
        ]
        .sort();

    },[complaints]);



    /* =====================================================
       PRIORITIES
    ===================================================== */

    const priorities = useMemo(()=>{

        const values =
            complaints
            .map(
                complaint =>
                    complaint?.priority
            )
            .filter(Boolean);


        return [
            ...new Set(values)
        ]
        .sort();

    },[complaints]);



    /* =====================================================
       BASE STATISTICS
    ===================================================== */

    const statistics = useMemo(()=>{

        const total =
            complaints.length;


        const pending =
            complaints.filter(
                complaint =>
                    getStatus(
                        complaint
                    )
                    .toLowerCase() ===
                    "pending"
            ).length;


        const inProgress =
            complaints.filter(
                complaint =>
                    getStatus(
                        complaint
                    )
                    .toLowerCase()
                    .replace(/\s+/g," ")
                    .trim() ===
                    "in progress"
            ).length;


        const resolved =
            complaints.filter(
                complaint =>
                    getStatus(
                        complaint
                    )
                    .toLowerCase() ===
                    "resolved"
            ).length;


        const resolutionRate =
            total > 0
                ?
                Math.round(
                    (
                        resolved /
                        total
                    ) * 100
                )
                :
                0;


        const today =
            complaints.filter(
                complaint =>
                    matchesSpecificDate(
                        complaint,
                        0
                    )
            ).length;


        const yesterday =
            complaints.filter(
                complaint =>
                    matchesSpecificDate(
                        complaint,
                        -1
                    )
            ).length;


        const week =
            complaints.filter(
                complaint => {

                    const date =
                        getDate(
                            complaint
                        );

                    return (
                        date &&
                        date >=
                        startOfWeek()
                    );

                }
            ).length;


        const month =
            complaints.filter(
                complaint => {

                    const date =
                        getDate(
                            complaint
                        );

                    return (
                        date &&
                        date >=
                        startOfMonth()
                    );

                }
            ).length;


        return {

            total,

            pending,

            inProgress,

            resolved,

            resolutionRate,

            today,

            yesterday,

            week,

            month

        };

    },[complaints]);



    /* =====================================================
       FILTERED COMPLAINTS
    ===================================================== */

    const filteredComplaints = useMemo(()=>{

        let result =
            [...complaints];


        const searchValue =
            search
            .trim()
            .toLowerCase();


        /* ================= SEARCH ================= */

        if(searchValue){

            result =
                result.filter(
                    complaint => {

                        const id =
                            String(
                                getComplaintId(
                                    complaint
                                )
                            )
                            .toLowerCase();


                        const title =
                            String(
                                complaint?.title ||
                                ""
                            )
                            .toLowerCase();


                        const description =
                            String(
                                complaint?.description ||
                                ""
                            )
                            .toLowerCase();


                        const category =
                            String(
                                getCategory(
                                    complaint
                                )
                            )
                            .toLowerCase();


                        const citizen =
                            String(
                                getCitizenName(
                                    complaint
                                )
                            )
                            .toLowerCase();


                        const email =
                            String(
                                getCitizenEmail(
                                    complaint
                                )
                            )
                            .toLowerCase();


                        const city =
                            String(
                                complaint?.address?.city ||
                                complaint?.city ||
                                ""
                            )
                            .toLowerCase();


                        const district =
                            String(
                                complaint?.address?.district ||
                                complaint?.district ||
                                ""
                            )
                            .toLowerCase();


                        const state =
                            String(
                                complaint?.address?.state ||
                                complaint?.state ||
                                ""
                            )
                            .toLowerCase();


                        const pincode =
                            String(
                                complaint?.address?.pincode ||
                                complaint?.pincode ||
                                ""
                            )
                            .toLowerCase();


                        const priority =
                            String(
                                getPriority(
                                    complaint
                                )
                            )
                            .toLowerCase();


                        return (

                            id.includes(
                                searchValue
                            ) ||

                            title.includes(
                                searchValue
                            ) ||

                            description.includes(
                                searchValue
                            ) ||

                            category.includes(
                                searchValue
                            ) ||

                            citizen.includes(
                                searchValue
                            ) ||

                            email.includes(
                                searchValue
                            ) ||

                            city.includes(
                                searchValue
                            ) ||

                            district.includes(
                                searchValue
                            ) ||

                            state.includes(
                                searchValue
                            ) ||

                            pincode.includes(
                                searchValue
                            ) ||

                            priority.includes(
                                searchValue
                            )

                        );

                    }
                );

        }



        /* ================= STATUS ================= */

        if(
            statusFilter !== "All"
        ){

            result =
                result.filter(
                    complaint =>
                        getStatus(
                            complaint
                        )
                        .toLowerCase()
                        .trim() ===
                        statusFilter
                        .toLowerCase()
                        .trim()
                );

        }



        /* ================= CATEGORY ================= */

        if(
            categoryFilter !== "All"
        ){

            result =
                result.filter(
                    complaint =>
                        getCategory(
                            complaint
                        ) ===
                        categoryFilter
                );

        }



        /* ================= PRIORITY ================= */

        if(
            priorityFilter !== "All"
        ){

            result =
                result.filter(
                    complaint =>
                        getPriority(
                            complaint
                        ) ===
                        priorityFilter
                );

        }



        /* ================= DATE ================= */

        result =
            result.filter(
                complaint =>
                    matchesDateFilter(
                        complaint
                    )
            );



        /* ================= SORT ================= */

        result.sort(
            (a,b)=>{

                if(
                    sortBy === "newest"
                ){

                    return (
                        (
                            getDate(b)
                            ?.getTime() ||
                            0
                        )
                        -
                        (
                            getDate(a)
                            ?.getTime() ||
                            0
                        )
                    );

                }


                if(
                    sortBy === "oldest"
                ){

                    return (
                        (
                            getDate(a)
                            ?.getTime() ||
                            0
                        )
                        -
                        (
                            getDate(b)
                            ?.getTime() ||
                            0
                        )
                    );

                }


                if(
                    sortBy === "titleAsc"
                ){

                    return String(
                        a?.title ||
                        ""
                    )
                    .localeCompare(
                        String(
                            b?.title ||
                            ""
                        )
                    );

                }


                if(
                    sortBy === "titleDesc"
                ){

                    return String(
                        b?.title ||
                        ""
                    )
                    .localeCompare(
                        String(
                            a?.title ||
                            ""
                        )
                    );

                }


                return 0;

            }
        );


        return result;

    },[
        complaints,
        search,
        statusFilter,
        categoryFilter,
        priorityFilter,
        dateFilter,
        sortBy
    ]);



    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages =
        Math.ceil(
            filteredComplaints.length /
            complaintsPerPage
        );


    const currentComplaints =
        filteredComplaints.slice(
            (
                currentPage - 1
            ) *
            complaintsPerPage,

            currentPage *
            complaintsPerPage
        );



    useEffect(()=>{

        setCurrentPage(1);

    },[
        search,
        statusFilter,
        categoryFilter,
        priorityFilter,
        dateFilter,
        sortBy
    ]);


    useEffect(()=>{

        if(
            totalPages > 0 &&
            currentPage > totalPages
        ){

            setCurrentPage(
                totalPages
            );

        }

    },[
        totalPages,
        currentPage
    ]);



    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {

        setSearch("");

        setStatusFilter("All");

        setCategoryFilter("All");

        setPriorityFilter("All");

        setDateFilter("All");

        setSortBy("newest");

        setCurrentPage(1);

    };



    /* =====================================================
       STATUS FILTER
    ===================================================== */

    const filterByStatus = (
        status
    ) => {

        setStatusFilter(
            status
        );

        setCurrentPage(1);

    };



    /* =====================================================
       STATUS CHART
    ===================================================== */

    const statusChartData = {

        labels:[
            "Pending",
            "In Progress",
            "Resolved"
        ],

        datasets:[
            {
                data:[
                    statistics.pending,
                    statistics.inProgress,
                    statistics.resolved
                ],

                backgroundColor:[
                    "#f59e0b",
                    "#3b82f6",
                    "#10b981"
                ],

                borderColor:"#ffffff",

                borderWidth:3,

                hoverOffset:8
            }
        ]

    };


    const statusChartOptions = {

        responsive:true,

        maintainAspectRatio:false,

        plugins:{
            legend:{
                position:"bottom"
            }
        }

    };



    /* =====================================================
       CATEGORY CHART
    ===================================================== */

    const categoryCounts =
        useMemo(()=>{

            const counts = {};


            complaints.forEach(
                complaint => {

                    const category =
                        getCategory(
                            complaint
                        );


                    counts[category] =
                        (
                            counts[category] ||
                            0
                        ) + 1;

                }
            );


            return counts;

        },[complaints]);


    const categoryLabels =
        Object.keys(
            categoryCounts
        );


    const categoryChartData = {

        labels:
            categoryLabels,

        datasets:[
            {
                label:
                    "Complaints",

                data:
                    categoryLabels.map(
                        category =>
                            categoryCounts[
                                category
                            ]
                    ),

                backgroundColor:[
                    "#2563eb",
                    "#7c3aed",
                    "#06b6d4",
                    "#10b981",
                    "#f59e0b",
                    "#f97316",
                    "#ec4899",
                    "#6366f1"
                ],

                borderRadius:8,

                borderSkipped:false
            }
        ]

    };


    const categoryChartOptions = {

        responsive:true,

        maintainAspectRatio:false,

        plugins:{
            legend:{
                display:false
            }
        },

        scales:{
            y:{
                beginAtZero:true,

                ticks:{
                    precision:0
                }
            }
        }

    };



    /* =====================================================
       PRIORITY CHART
    ===================================================== */

    const priorityCounts =
        useMemo(()=>{

            const counts = {};


            complaints.forEach(
                complaint => {

                    const priority =
                        getPriority(
                            complaint
                        );


                    counts[priority] =
                        (
                            counts[priority] ||
                            0
                        ) + 1;

                }
            );


            return counts;

        },[complaints]);


    const priorityLabels =
        Object.keys(
            priorityCounts
        );


    const priorityChartData = {

        labels:
            priorityLabels,

        datasets:[
            {
                label:
                    "Complaints",

                data:
                    priorityLabels.map(
                        priority =>
                            priorityCounts[
                                priority
                            ]
                    ),

                backgroundColor:
                    priorityLabels.map(
                        priority => {
                            const value = String(priority).toLowerCase();

                            if(value === "urgent") return "#ef4444";
                            if(value === "high") return "#f97316";
                            if(value === "medium") return "#f59e0b";
                            if(value === "low") return "#10b981";

                            return "#64748b";
                        }
                    ),

                borderRadius:8,

                borderSkipped:false
            }
        ]

    };


    const priorityChartOptions = {

        responsive:true,

        maintainAspectRatio:false,

        plugins:{
            legend:{
                display:false
            }
        },

        scales:{
            y:{
                beginAtZero:true,

                ticks:{
                    precision:0
                }
            }
        }

    };



    /* =====================================================
       LAST 7 DAYS ANALYTICS
    ===================================================== */

    const timeAnalytics =
        useMemo(()=>{

            const days = [];

            const counts = [];


            for(
                let i = 6;
                i >= 0;
                i--
            ){

                const date =
                    new Date();


                date.setDate(
                    date.getDate() - i
                );


                const start =
                    startOfDay(
                        date
                    );


                const end =
                    endOfDay(
                        date
                    );


                const count =
                    complaints.filter(
                        complaint => {

                            const complaintDate =
                                getDate(
                                    complaint
                                );


                            return (
                                complaintDate &&
                                complaintDate >= start &&
                                complaintDate <= end
                            );

                        }
                    ).length;


                days.push(
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            day:"2-digit",
                            month:"short"
                        }
                    )
                );


                counts.push(
                    count
                );

            }


            return {
                days,
                counts
            };

        },[complaints]);


    const timeChartData = {

        labels:
            timeAnalytics.days,

        datasets:[
            {
                label:
                    "Complaints",

                data:
                    timeAnalytics.counts,

                tension:.35,

                fill:true,

                borderColor:"#2563eb",

                backgroundColor:"rgba(37,99,235,0.12)",

                borderWidth:3,

                pointRadius:4,

                pointHoverRadius:7,

                pointBackgroundColor:"#2563eb",

                pointBorderColor:"#ffffff",

                pointBorderWidth:2

            }
        ]

    };


    const timeChartOptions = {

        responsive:true,

        maintainAspectRatio:false,

        plugins:{
            legend:{
                display:false
            }
        },

        scales:{
            y:{
                beginAtZero:true,

                ticks:{
                    precision:0
                }
            }
        }

    };



    /* =====================================================
       LOCATION ANALYTICS
    ===================================================== */

    const locationCounts =
        useMemo(()=>{

            const counts = {};


            complaints.forEach(
                complaint => {

                    const city =
                        complaint?.address?.city ||
                        complaint?.city ||
                        complaint?.address?.district ||
                        complaint?.district ||
                        complaint?.address?.state ||
                        complaint?.state ||
                        "Unknown";


                    counts[city] =
                        (
                            counts[city] ||
                            0
                        ) + 1;

                }
            );


            return Object.entries(
                counts
            )
            .sort(
                (a,b) =>
                    b[1] - a[1]
            )
            .slice(
                0,
                5
            );

        },[complaints]);



    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDateTime = (
        dateValue
    ) => {

        if(!dateValue){

            return "N/A";

        }


        const date =
            new Date(
                dateValue
            );


        if(
            Number.isNaN(
                date.getTime()
            )
        ){

            return "N/A";

        }


        return date.toLocaleString(
            "en-IN",
            {
                day:"2-digit",
                month:"short",
                year:"numeric",
                hour:"2-digit",
                minute:"2-digit"
            }
        );

    };



    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = (
        status
    ) => {

        return String(
            status || "Pending"
        )
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

    };


    const getPriorityClass = (
        priority
    ) => {

        return String(
            priority || "Normal"
        )
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

    };



    /* =====================================================
       LOADING
    ===================================================== */

    if(loading){

        return(

            <div className="admin-loading">

                <div className="admin-loader-icon">
                    🏛️
                </div>

                <div className="loader-spinner"></div>

                <h2>
                    Loading Admin Dashboard
                </h2>

                <p>
                    Preparing CivicConnect analytics...
                </p>

            </div>

        );

    }



    /* =====================================================
       ERROR
    ===================================================== */

    if(error){

        return(

            <div className="admin-error-page">

                <div className="admin-error-icon">
                    ⚠️
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="admin-primary-btn"
                    onClick={handleRefresh}
                >
                    🔄 Try Again
                </button>

            </div>

        );

    }



    /* =====================================================
       RETURN
    ===================================================== */

    return(

        <div className="admin-dashboard">


            {/* =================================================
               TOP BAR
            ================================================= */}

            <div className="admin-topbar">

                <div className="admin-brand">

                    <div className="admin-brand-icon">
                        🏙️
                    </div>

                    <div>

                        <h2>
                            CivicConnect
                        </h2>

                        <span>
                            Administration Portal
                        </span>

                    </div>

                </div>


                <div className="admin-top-actions">

                    <button
                        className="top-action-btn"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >

                        {refreshing
                            ? "⏳ Refreshing..."
                            : "🔄 Refresh"
                        }

                    </button>


                    <button
                        className="top-action-btn"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        🏠 Home
                    </button>

                </div>

            </div>



            {/* =================================================
               HEADER
            ================================================= */}

            <section className="admin-header">

                <div>

                    <span className="admin-eyebrow">
                        ADMIN CONTROL CENTER
                    </span>

                    <h1>
                        Dashboard Analytics
                    </h1>

                    <p>
                        Monitor public complaints,
                        track resolution performance,
                        and manage civic issues efficiently.
                    </p>

                </div>


                <div className="admin-header-date">

                    <span>
                        TODAY
                    </span>

                    <strong>
                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday:"long",
                                day:"numeric",
                                month:"long",
                                year:"numeric"
                            }
                        )}
                    </strong>

                </div>

            </section>



            {/* =================================================
               STATISTICS
            ================================================= */}

            <section className="admin-stats-grid">


                <button
                    className={`admin-stat-card total-card ${
                        statusFilter === "All"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        filterByStatus("All")
                    }
                >

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            📋
                        </div>

                        <span>
                            ALL
                        </span>

                    </div>

                    <strong>
                        {statistics.total}
                    </strong>

                    <p>
                        Total Complaints
                    </p>

                </button>



                <button
                    className={`admin-stat-card pending-card ${
                        statusFilter === "Pending"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        filterByStatus("Pending")
                    }
                >

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            ⏳
                        </div>

                        <span>
                            PENDING
                        </span>

                    </div>

                    <strong>
                        {statistics.pending}
                    </strong>

                    <p>
                        Awaiting Action
                    </p>

                </button>



                <button
                    className={`admin-stat-card progress-card ${
                        statusFilter === "In Progress"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        filterByStatus(
                            "In Progress"
                        )
                    }
                >

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            🔧
                        </div>

                        <span>
                            ACTIVE
                        </span>

                    </div>

                    <strong>
                        {statistics.inProgress}
                    </strong>

                    <p>
                        In Progress
                    </p>

                </button>



                <button
                    className={`admin-stat-card resolved-card ${
                        statusFilter === "Resolved"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        filterByStatus(
                            "Resolved"
                        )
                    }
                >

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <span>
                            RESOLVED
                        </span>

                    </div>

                    <strong>
                        {statistics.resolved}
                    </strong>

                    <p>
                        Successfully Resolved
                    </p>

                </button>



                <div className="admin-stat-card rate-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            📈
                        </div>

                        <span>
                            PERFORMANCE
                        </span>

                    </div>

                    <strong>
                        {statistics.resolutionRate}%
                    </strong>

                    <p>
                        Resolution Rate
                    </p>

                    <div className="mini-progress">

                        <div
                            style={{
                                width:
                                    `${statistics.resolutionRate}%`
                            }}
                        ></div>

                    </div>

                </div>



                <div className="admin-stat-card today-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            📅
                        </div>

                        <span>
                            TODAY
                        </span>

                    </div>

                    <strong>
                        {statistics.today}
                    </strong>

                    <p>
                        Complaints Today
                    </p>

                </div>



                <div className="admin-stat-card week-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            📆
                        </div>

                        <span>
                            THIS WEEK
                        </span>

                    </div>

                    <strong>
                        {statistics.week}
                    </strong>

                    <p>
                        Complaints This Week
                    </p>

                </div>



                <div className="admin-stat-card month-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            🗓️
                        </div>

                        <span>
                            THIS MONTH
                        </span>

                    </div>

                    <strong>
                        {statistics.month}
                    </strong>

                    <p>
                        Complaints This Month
                    </p>

                </div>

            </section>



            {/* =================================================
               ANALYTICS
            ================================================= */}

            <section className="analytics-section">

                <div className="section-heading">

                    <div>

                        <span>
                            INSIGHTS
                        </span>

                        <h2>
                            Civic Activity Analytics
                        </h2>

                    </div>

                    <p>
                        Live insights calculated from
                        your complaint data
                    </p>

                </div>



                <div className="analytics-grid">


                    {/* STATUS */}

                    <div className="chart-card">

                        <div className="chart-header">

                            <div>

                                <span>
                                    STATUS
                                </span>

                                <h3>
                                    Complaint Status
                                </h3>

                            </div>

                            <div className="chart-header-icon">
                                📊
                            </div>

                        </div>


                        <div className="chart-container pie-container">

                            <Pie
                                data={
                                    statusChartData
                                }
                                options={
                                    statusChartOptions
                                }
                            />

                        </div>

                    </div>



                    {/* TREND */}

                    <div className="chart-card large-chart">

                        <div className="chart-header">

                            <div>

                                <span>
                                    LAST 7 DAYS
                                </span>

                                <h3>
                                    Complaint Activity
                                </h3>

                            </div>

                            <div className="chart-header-icon">
                                📈
                            </div>

                        </div>


                        <div className="chart-container">

                            <Line
                                data={
                                    timeChartData
                                }
                                options={
                                    timeChartOptions
                                }
                            />

                        </div>

                    </div>



                    {/* CATEGORY */}

                    <div className="chart-card">

                        <div className="chart-header">

                            <div>

                                <span>
                                    CATEGORIES
                                </span>

                                <h3>
                                    Complaint Categories
                                </h3>

                            </div>

                            <div className="chart-header-icon">
                                🏷️
                            </div>

                        </div>


                        <div className="chart-container">

                            {categoryLabels.length > 0

                                ?

                                <Bar
                                    data={
                                        categoryChartData
                                    }
                                    options={
                                        categoryChartOptions
                                    }
                                />

                                :

                                <div className="chart-empty">
                                    No category data
                                </div>

                            }

                        </div>

                    </div>



                    {/* PRIORITY */}

                    <div className="chart-card">

                        <div className="chart-header">

                            <div>

                                <span>
                                    PRIORITY
                                </span>

                                <h3>
                                    Priority Distribution
                                </h3>

                            </div>

                            <div className="chart-header-icon">
                                🚦
                            </div>

                        </div>


                        <div className="chart-container">

                            {priorityLabels.length > 0

                                ?

                                <Bar
                                    data={
                                        priorityChartData
                                    }
                                    options={
                                        priorityChartOptions
                                    }
                                />

                                :

                                <div className="chart-empty">
                                    No priority data available
                                </div>

                            }

                        </div>

                    </div>



                    {/* LOCATION */}

                    <div className="chart-card location-card">

                        <div className="chart-header">

                            <div>

                                <span>
                                    LOCATIONS
                                </span>

                                <h3>
                                    Top Complaint Cities
                                </h3>

                            </div>

                            <div className="chart-header-icon">
                                🏙️
                            </div>

                        </div>


                        <div className="location-list">

                            {locationCounts.length === 0

                                ?

                                <div className="chart-empty">
                                    No location data available
                                </div>

                                :

                                locationCounts.map(
                                    ([city,count],index) => {

                                        const percentage =
                                            statistics.total > 0
                                                ?
                                                Math.round(
                                                    (
                                                        count /
                                                        statistics.total
                                                    ) * 100
                                                )
                                                :
                                                0;


                                        return(

                                            <div
                                                className="location-row"
                                                key={city}
                                            >

                                                <div className="location-rank">
                                                    {index + 1}
                                                </div>


                                                <div className="location-main">

                                                    <div className="location-info">

                                                        <strong>
                                                            {city}
                                                        </strong>

                                                        <span>
                                                            {count}
                                                            {" "}
                                                            complaint
                                                            {count !== 1
                                                                ? "s"
                                                                : ""
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="location-progress">

                                                        <div
                                                            style={{
                                                                width:
                                                                    `${percentage}%`
                                                            }}
                                                        ></div>

                                                    </div>

                                                </div>


                                                <strong className="location-percent">
                                                    {percentage}%
                                                </strong>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    </div>

                </div>

            </section>



            {/* =================================================
               COMPLAINT MANAGEMENT
            ================================================= */}

            <section className="complaints-section">

                <div className="section-heading">

                    <div>

                        <span>
                            CASE MANAGEMENT
                        </span>

                        <h2>
                            Manage Complaints
                        </h2>

                    </div>

                    <p>
                        {filteredComplaints.length}
                        {" "}
                        matching complaint
                        {filteredComplaints.length !== 1
                            ? "s"
                            : ""
                        }
                    </p>

                </div>



                {/* FILTER PANEL */}

                <div className="filter-panel">


                    <div className="search-box">

                        <span>
                            🔎
                        </span>

                        <input
                            type="text"
                            placeholder="Search complaints, citizens, ID, location..."
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {search && (

                            <button
                                className="clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>

                        )}

                    </div>



                    <select
                        value={statusFilter}
                        onChange={e =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Resolved">
                            Resolved
                        </option>

                    </select>



                    <select
                        value={categoryFilter}
                        onChange={e =>
                            setCategoryFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Categories
                        </option>

                        {categories.map(
                            category => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>

                            )
                        )}

                    </select>



                    <select
                        value={priorityFilter}
                        onChange={e =>
                            setPriorityFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Priorities
                        </option>

                        {priorities.map(
                            priority => (

                                <option
                                    key={priority}
                                    value={priority}
                                >
                                    {priority}
                                </option>

                            )
                        )}

                    </select>



                    <select
                        value={dateFilter}
                        onChange={e =>
                            setDateFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Dates
                        </option>

                        <option value="Today">
                            Today
                        </option>

                        <option value="Yesterday">
                            Yesterday
                        </option>

                        <option value="7days">
                            Last 7 Days
                        </option>

                        <option value="30days">
                            Last 30 Days
                        </option>

                        <option value="Week">
                            This Week
                        </option>

                        <option value="Month">
                            This Month
                        </option>

                    </select>



                    <select
                        value={sortBy}
                        onChange={e =>
                            setSortBy(
                                e.target.value
                            )
                        }
                    >

                        <option value="newest">
                            Newest First
                        </option>

                        <option value="oldest">
                            Oldest First
                        </option>

                        <option value="titleAsc">
                            Title A → Z
                        </option>

                        <option value="titleDesc">
                            Title Z → A
                        </option>

                    </select>



                    <button
                        className="clear-filter-btn"
                        onClick={clearFilters}
                    >
                        ↻ Clear
                    </button>

                </div>



                {/* ACTIVE FILTERS */}

                {(search ||
                    statusFilter !== "All" ||
                    categoryFilter !== "All" ||
                    priorityFilter !== "All" ||
                    dateFilter !== "All") && (

                    <div className="active-filter-bar">

                        <span>
                            Active filters:
                        </span>


                        {search && (

                            <button
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                Search: {search} ×
                            </button>

                        )}


                        {statusFilter !== "All" && (

                            <button
                                onClick={() =>
                                    setStatusFilter(
                                        "All"
                                    )
                                }
                            >
                                Status: {statusFilter} ×
                            </button>

                        )}


                        {categoryFilter !== "All" && (

                            <button
                                onClick={() =>
                                    setCategoryFilter(
                                        "All"
                                    )
                                }
                            >
                                Category: {categoryFilter} ×
                            </button>

                        )}


                        {priorityFilter !== "All" && (

                            <button
                                onClick={() =>
                                    setPriorityFilter(
                                        "All"
                                    )
                                }
                            >
                                Priority: {priorityFilter} ×
                            </button>

                        )}


                        {dateFilter !== "All" && (

                            <button
                                onClick={() =>
                                    setDateFilter(
                                        "All"
                                    )
                                }
                            >
                                Date: {dateFilter} ×
                            </button>

                        )}

                    </div>

                )}



                {/* COMPLAINTS */}

                {currentComplaints.length === 0

                    ?

                    <div className="admin-empty">

                        <div className="empty-icon">
                            🔍
                        </div>

                        <h3>
                            No complaints found
                        </h3>

                        <p>
                            Try changing your filters
                            or search terms.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="admin-primary-btn"
                        >
                            Clear Filters
                        </button>

                    </div>

                    :

                    <div className="complaints-list">

                        {currentComplaints.map(
                            complaint => {

                                const id =
                                    getComplaintId(
                                        complaint
                                    );


                                const status =
                                    getStatus(
                                        complaint
                                    );


                                const priority =
                                    getPriority(
                                        complaint
                                    );


                                const image =
                                    complaint?.image
                                    ?
                                    `${(
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
).replace(/\/api\/?$/, "")}/uploads/${complaint.image}`
                                    :
                                    null;


                                return(

                                    <article
                                        className="admin-complaint-card"
                                        key={String(id)}
                                    >


                                        {/* IMAGE */}

                                        <div className="complaint-image">

                                            {image

                                                ?

                                                <img
                                                    src={image}
                                                    alt="Complaint evidence"
                                                    onError={e => {

                                                        e.currentTarget.style.display =
                                                            "none";

                                                    }}
                                                />

                                                :

                                                <div className="no-image">

                                                    📷

                                                    <span>
                                                        No Evidence
                                                    </span>

                                                </div>

                                            }

                                        </div>



                                        {/* CONTENT */}

                                        <div className="complaint-content">


                                            <div className="complaint-top-row">

                                                <div>

                                                    <div className="complaint-id">
                                                        ID: {String(id).slice(-10)}
                                                    </div>

                                                    <h3>
                                                        {complaint?.title ||
                                                            "Untitled Complaint"}
                                                    </h3>

                                                </div>


                                                <div className="complaint-badges">

                                                    <span
                                                        className={`status-badge ${getStatusClass(status)}`}
                                                    >
                                                        {status}
                                                    </span>


                                                    <span
                                                        className={`priority-badge ${getPriorityClass(priority)}`}
                                                    >
                                                        {priority}
                                                    </span>

                                                </div>

                                            </div>



                                            <p className="complaint-description">

                                                {complaint?.description ||
                                                    "No description available."}

                                            </p>



                                            <div className="complaint-meta-grid">


                                                <div className="meta-item">

                                                    <span>
                                                        👤
                                                    </span>

                                                    <div>

                                                        <small>
                                                            CITIZEN
                                                        </small>

                                                        <strong>
                                                            {getCitizenName(
                                                                complaint
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>



                                                <div className="meta-item">

                                                    <span>
                                                        🏷️
                                                    </span>

                                                    <div>

                                                        <small>
                                                            CATEGORY
                                                        </small>

                                                        <strong>
                                                            {getCategory(
                                                                complaint
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>



                                                <div className="meta-item">

                                                    <span>
                                                        📍
                                                    </span>

                                                    <div>

                                                        <small>
                                                            LOCATION
                                                        </small>

                                                        <strong>
                                                            {getLocation(
                                                                complaint
                                                            ) ||
                                                            "Location unavailable"}
                                                        </strong>

                                                    </div>

                                                </div>



                                                <div className="meta-item">

                                                    <span>
                                                        🕒
                                                    </span>

                                                    <div>

                                                        <small>
                                                            SUBMITTED
                                                        </small>

                                                        <strong>
                                                            {formatDateTime(
                                                                complaint?.createdAt
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>

                                            </div>



                                            <div className="complaint-actions">


                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/complaint/${id}`
                                                        )
                                                    }
                                                >
                                                    👁 View Details
                                                </button>


                                                {status
                                                    .toLowerCase()
                                                    .trim() !==
                                                    "in progress" &&

                                                    status
                                                    .toLowerCase()
                                                    .trim() !==
                                                    "resolved" && (

                                                    <button
                                                        className="work-btn"
                                                        onClick={() =>
                                                            updateStatus(
                                                                id,
                                                                "In Progress"
                                                            )
                                                        }
                                                    >
                                                        🔧 Start Work
                                                    </button>

                                                )}


                                                {status
                                                    .toLowerCase()
                                                    .trim() !==
                                                    "resolved" && (

                                                    <button
                                                        className="resolve-btn"
                                                        onClick={() =>
                                                            updateStatus(
                                                                id,
                                                                "Resolved"
                                                            )
                                                        }
                                                    >
                                                        ✓ Resolve
                                                    </button>

                                                )}


                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteComplaint(
                                                            id
                                                        )
                                                    }
                                                >
                                                    🗑 Delete
                                                </button>

                                            </div>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                }



                {/* PAGINATION */}

                {totalPages > 1 && (

                    <div className="pagination">

                        <button
                            disabled={
                                currentPage === 1
                            }
                            onClick={() =>
                                setCurrentPage(
                                    previous =>
                                        previous - 1
                                )
                            }
                        >
                            ← Previous
                        </button>


                        <div className="page-numbers">

                            {Array.from(
                                {
                                    length:
                                        totalPages
                                },
                                (_,index) => {

                                    const page =
                                        index + 1;


                                    return(

                                        <button
                                            key={page}
                                            className={
                                                currentPage === page
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    page
                                                )
                                            }
                                        >
                                            {page}
                                        </button>

                                    );

                                }
                            )}

                        </div>


                        <button
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    previous =>
                                        previous + 1
                                )
                            }
                        >
                            Next →
                        </button>

                    </div>

                )}

            </section>



            {/* =================================================
               FOOTER
            ================================================= */}

            <footer className="admin-footer">

                <div>

                    <strong>
                        🏙️ CivicConnect
                    </strong>

                    <span>
                        Digital Public Issue Management Platform
                    </span>

                </div>


                <span>
                    Admin Control Center
                </span>

            </footer>


        </div>

    );

}


export default AdminDashboard;