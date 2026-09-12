import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import Select from "react-select";

import CreatableSelect from "react-select/creatable";

import API from "../api/axios";

import "./CreateComplaint.css";


function CreateComplaint() {


    const navigate = useNavigate();


    /* =====================================================
       INITIAL FORM
    ===================================================== */

    const initialForm = {

        title: "",
        description: "",
        category: "",

        state: "",
        district: "",
        city: "",
        street: "",
        pincode: ""

    };


    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] =
        useState(initialForm);


    const [image, setImage] =
        useState(null);


    const [preview, setPreview] =
        useState(null);


    const [states, setStates] =
        useState([]);


    const [districtOptions, setDistrictOptions] =
        useState([]);


    const [cityOptions, setCityOptions] =
        useState([]);


    const [selectedState, setSelectedState] =
        useState(null);


    const [selectedDistrict, setSelectedDistrict] =
        useState(null);


    const [selectedCity, setSelectedCity] =
        useState(null);


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState("");


    /* =====================================================
       PREVENT HORIZONTAL SCROLL
    ===================================================== */

    useEffect(() => {

        const html =
            document.documentElement;

        const body =
            document.body;

        const root =
            document.getElementById("root");


        const previousHtmlOverflowX =
            html.style.overflowX;

        const previousBodyOverflowX =
            body.style.overflowX;

        const previousRootOverflowX =
            root
                ? root.style.overflowX
                : "";


        html.style.overflowX =
            "hidden";

        body.style.overflowX =
            "hidden";


        if (root) {

            root.style.overflowX =
                "hidden";

        }


        window.scrollTo({

            left: 0,

            top: window.scrollY

        });


        return () => {

            html.style.overflowX =
                previousHtmlOverflowX;

            body.style.overflowX =
                previousBodyOverflowX;


            if (root) {

                root.style.overflowX =
                    previousRootOverflowX;

            }

        };

    }, []);


    /* =====================================================
       CLEAN IMAGE PREVIEW URL
    ===================================================== */

    useEffect(() => {

        return () => {

            if (preview) {

                URL.revokeObjectURL(
                    preview
                );

            }

        };

    }, [preview]);


    /* =====================================================
       CATEGORY
    ===================================================== */

    const categories = [

        {
            value: "Road",
            label: "🛣️ Road Issue"
        },

        {
            value: "Water",
            label: "💧 Water Supply"
        },

        {
            value: "Electricity",
            label: "⚡ Electricity Problem"
        },

        {
            value: "Garbage",
            label: "🗑️ Garbage Collection"
        },

        {
            value: "Street Light",
            label: "💡 Street Light"
        },

        {
            value: "Drainage",
            label: "🚰 Drainage Problem"
        },

        {
            value: "Other",
            label: "🏙️ Other"
        }

    ];


    /* =====================================================
       LOAD STATES
    ===================================================== */

    useEffect(() => {

        const loadStates = async () => {

            try {

                const res =
                    await API.get(
                        "/location/states"
                    );


                const stateData =
                    Array.isArray(res.data)
                        ? res.data
                        : [];


                setStates(

                    stateData.map(
                        item => ({

                            value: item,

                            label: item

                        })
                    )

                );

            }

            catch (err) {

                console.log(
                    "LOAD STATES ERROR:",
                    err
                );

                setStates([]);

            }

        };


        loadStates();

    }, []);


    /* =====================================================
       NORMAL INPUT CHANGE
    ===================================================== */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /* =====================================================
       IMAGE
    ===================================================== */

    const handleImage = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {

            return;

        }


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file"
            );

            e.target.value = "";

            return;

        }


        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Image size must be below 5MB"
            );

            e.target.value = "";

            return;

        }


        if (preview) {

            URL.revokeObjectURL(
                preview
            );

        }


        setImage(file);


        setPreview(
            URL.createObjectURL(file)
        );

    };


    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    const removeImage = () => {

        if (preview) {

            URL.revokeObjectURL(
                preview
            );

        }


        setImage(null);

        setPreview(null);

    };


    /* =====================================================
       GET DISTRICTS
    ===================================================== */

    const getDistricts = async (state) => {

        if (!state) {

            setDistrictOptions([]);

            return;

        }


        try {

            const res =
                await API.get(

                    `/location/districts/${encodeURIComponent(
                        state
                    )}`

                );


            const districtData =
                Array.isArray(res.data)
                    ? res.data
                    : [];


            setDistrictOptions(

                districtData.map(
                    item => ({

                        value: item,

                        label: item

                    })
                )

            );

        }

        catch (err) {

            console.log(
                "LOAD DISTRICTS ERROR:",
                err
            );

            /*
             * Do not block manual entry.
             * Citizen can still create
             * district manually.
             */

            setDistrictOptions([]);

        }

    };


    /* =====================================================
       SEARCH CITY
       IMPORTANT:
       This function performs the API request,
       but it does NOT get directly passed to
       React Select's onInputChange.
    ===================================================== */

    const searchCity = async (
        value
    ) => {

        const searchValue =
            String(value || "")
                .trim();


        if (
            searchValue.length < 2
        ) {

            return;

        }


        try {

            const res =
                await API.get(

                    `/location/search/${encodeURIComponent(
                        searchValue
                    )}`

                );


            const cityData =
                Array.isArray(res.data)
                    ? res.data
                    : [];


            const options =
                cityData.map(
                    item => ({

                        value:
                            item.name,

                        label:
                            item.district
                                ? `${item.name} (${item.district})`
                                : item.name

                    })
                );


            setCityOptions(
                options
            );

        }

        catch (err) {

            console.log(
                "SEARCH CITY ERROR:",
                err
            );

            /*
             * Keep the options empty.
             * Manual city creation still works.
             */

            setCityOptions([]);

        }

    };


    /* =====================================================
       CITY INPUT CHANGE
       IMPORTANT FIX FOR [object Promise]
    ===================================================== */

    const handleCityInputChange = (
        value,
        actionMeta
    ) => {

        /*
         * Only search when the user
         * is actually typing.
         */

        if (
            actionMeta?.action ===
            "input-change"
        ) {

            searchCity(value);

        }


        /*
         * VERY IMPORTANT:
         * React Select expects the actual
         * input value to be returned.
         *
         * Returning an async function /
         * Promise here causes:
         *
         * [object Promise]
         */

        return value;

    };


    /* =====================================================
       PINCODE
    ===================================================== */

    const searchPincode = async () => {

        if (
            formData.pincode.length !== 6
        ) {

            alert(
                "Enter valid 6-digit pincode"
            );

            return;

        }


        try {

            const res =
                await API.get(

                    `/location/pincode/${formData.pincode}`

                );


            const data =
                res.data;


            if (
                !data ||
                !data.state ||
                !data.district ||
                !data.city
            ) {

                alert(
                    "Address could not be found for this pincode"
                );

                return;

            }


            const stateOption = {

                value:
                    data.state,

                label:
                    data.state

            };


            const districtOption = {

                value:
                    data.district,

                label:
                    data.district

            };


            const cityOption = {

                value:
                    data.city,

                label:
                    data.city

            };


            setSelectedState(
                stateOption
            );


            setSelectedDistrict(
                districtOption
            );


            setSelectedCity(
                cityOption
            );


            /*
             * Load complete district list.
             * This allows the citizen to
             * correct the district.
             */

            await getDistricts(
                data.state
            );


            /*
             * Keep pincode city as
             * initial suggestion.
             */

            setCityOptions([

                cityOption

            ]);


            setFormData(prev => ({

                ...prev,

                state:
                    data.state,

                district:
                    data.district,

                city:
                    data.city

            }));


            alert(
                "Address suggestion found. Please verify and correct the State, District and City before submitting."
            );

        }

        catch (err) {

            console.log(
                "PINCODE SEARCH ERROR:",
                err
            );


            alert(
                "Unable to find address for this pincode. You can enter the address manually."
            );

        }

    };


    /* =====================================================
       CREATE STATE MANUALLY
    ===================================================== */

    const handleCreateState = (
        inputValue
    ) => {

        const value =
            inputValue.trim();


        if (!value) {

            return;

        }


        const option = {

            value: value,

            label: value

        };


        setSelectedState(
            option
        );


        setSelectedDistrict(
            null
        );


        setSelectedCity(
            null
        );


        setDistrictOptions(
            []
        );


        setCityOptions(
            []
        );


        setFormData(prev => ({

            ...prev,

            state:
                value,

            district:
                "",

            city:
                ""

        }));


        /*
         * Try to load districts
         * for manually entered state.
         */

        getDistricts(
            value
        );

    };


    /* =====================================================
       CREATE DISTRICT MANUALLY
    ===================================================== */

    const handleCreateDistrict = (
        inputValue
    ) => {

        const value =
            inputValue.trim();


        if (!value) {

            return;

        }


        const option = {

            value: value,

            label: value

        };


        setSelectedDistrict(
            option
        );


        setFormData(prev => ({

            ...prev,

            district:
                value

        }));

    };


    /* =====================================================
       CREATE CITY MANUALLY
    ===================================================== */

    const handleCreateCity = (
        inputValue
    ) => {

        const value =
            inputValue.trim();


        if (!value) {

            return;

        }


        const option = {

            value: value,

            label: value

        };


        setSelectedCity(
            option
        );


        /*
         * Keep manually created city
         * available in the options.
         */

        setCityOptions(
            previous => {

                const exists =
                    previous.some(
                        item =>
                            String(
                                item.value
                            ).toLowerCase() ===
                            value.toLowerCase()
                    );


                if (exists) {

                    return previous;

                }


                return [

                    ...previous,

                    option

                ];

            }
        );


        setFormData(prev => ({

            ...prev,

            city:
                value

        }));

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.title.trim()) {

            alert(
                "Enter complaint title"
            );

            return;

        }


        if (!formData.category) {

            alert(
                "Select category"
            );

            return;

        }


        if (
            formData.description.trim().length <
            20
        ) {

            alert(
                "Description should contain minimum 20 characters"
            );

            return;

        }


        if (
            !formData.pincode ||
            formData.pincode.length !== 6
        ) {

            alert(
                "Enter a valid 6-digit pincode"
            );

            return;

        }


        if (!formData.state.trim()) {

            alert(
                "Enter or select state"
            );

            return;

        }


        if (!formData.district.trim()) {

            alert(
                "Enter or select district"
            );

            return;

        }


        if (!formData.city.trim()) {

            alert(
                "Enter or select city"
            );

            return;

        }


        if (!formData.street.trim()) {

            alert(
                "Enter street / area / landmark"
            );

            return;

        }


        try {

            setLoading(true);

            setMessage("");


            const data =
                new FormData();


            Object.keys(formData).forEach(
                key => {

                    data.append(
                        key,
                        formData[key]
                    );

                }
            );


            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            /*
             * Do not manually set the
             * multipart boundary.
             */

            await API.post(

                "/complaints/create",

                data

            );


            setMessage(
                "Complaint Submitted Successfully"
            );


            setTimeout(() => {

                navigate(
                    "/citizen-dashboard"
                );

            }, 1500);

        }

        catch (err) {

            console.log(
                "CREATE COMPLAINT ERROR:",
                err
            );


            alert(

                err.response?.data?.message ||
                "Complaint failed"

            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       SELECT STYLES
       CURSOR FIX
    ===================================================== */

    const selectStyles = {

        /* =================================================
           CONTROL
           POINTER WHEN HOVERING DROPDOWN
        ================================================= */

        control: (
            base,
            state
        ) => ({

            ...base,

            width: "100%",

            minHeight: "56px",

            borderRadius: "15px",

            borderColor:
                state.isFocused
                    ? "#2563eb"
                    : "#dbe3ef",

            boxShadow:
                state.isFocused
                    ? "0 0 0 4px rgba(37,99,235,.10)"
                    : "none",

            backgroundColor:
                "#ffffff",

            /* FIXED */
            cursor:
                "pointer",

            "&:hover": {

                borderColor:
                    "#2563eb"

            }

        }),


        /* =================================================
           VALUE CONTAINER
        ================================================= */

        valueContainer:
            (base) => ({

                ...base,

                minWidth: 0,

                padding:
                    "4px 15px",

                cursor:
                    "pointer"

            }),


        /* =================================================
           PLACEHOLDER
        ================================================= */

        placeholder:
            (base) => ({

                ...base,

                color:
                    "#94a3b8",

                fontSize:
                    "15px",

                cursor:
                    "pointer"

            }),


        /* =================================================
           SELECTED VALUE
        ================================================= */

        singleValue:
            (base) => ({

                ...base,

                maxWidth:
                    "calc(100% - 10px)",

                overflow:
                    "hidden",

                textOverflow:
                    "ellipsis",

                whiteSpace:
                    "nowrap",

                color:
                    "#1e293b",

                fontSize:
                    "15px",

                fontWeight:
                    "600",

                cursor:
                    "pointer"

            }),


        /* =================================================
           ACTUAL TEXT INPUT
           TEXT CURSOR
        ================================================= */

        input:
            (base) => ({

                ...base,

                color:
                    "#1e293b",

                minWidth:
                    "0",

                cursor:
                    "text"

            }),


        /* =================================================
           CLEAR X BUTTON
        ================================================= */

        clearIndicator:
            (base) => ({

                ...base,

                cursor:
                    "pointer",

                padding:
                    "8px",

                color:
                    "#cbd5e1",

                "&:hover": {

                    color:
                        "#ef4444"

                }

            }),


        /* =================================================
           DROPDOWN ARROW
        ================================================= */

        dropdownIndicator:
            (base) => ({

                ...base,

                cursor:
                    "pointer",

                padding:
                    "8px",

                color:
                    "#94a3b8",

                "&:hover": {

                    color:
                        "#2563eb"

                }

            }),


        /* =================================================
           SEPARATOR
        ================================================= */

        indicatorSeparator:
            (base) => ({

                ...base,

                backgroundColor:
                    "#e2e8f0"

            }),


        /* =================================================
           MENU
        ================================================= */

        menu:
            (base) => ({

                ...base,

                width:
                    "100%",

                minWidth:
                    "100%",

                borderRadius:
                    "14px",

                overflow:
                    "hidden",

                boxShadow:
                    "0 15px 40px rgba(15,23,42,.15)",

                zIndex:
                    99999

            }),


        /* =================================================
           MENU PORTAL
        ================================================= */

        menuPortal:
            (base) => ({

                ...base,

                zIndex:
                    99999

            }),


        /* =================================================
           MENU LIST
        ================================================= */

        menuList:
            (base) => ({

                ...base,

                maxHeight:
                    "260px",

                overflowY:
                    "auto",

                overflowX:
                    "hidden"

            }),


        /* =================================================
           OPTIONS
        ================================================= */

        option:
            (base, state) => ({

                ...base,

                padding:
                    "12px 15px",

                backgroundColor:
                    state.isFocused
                        ? "#eff6ff"
                        : "#ffffff",

                color:
                    "#1e293b",

                cursor:
                    "pointer",

                overflowWrap:
                    "break-word",

                wordBreak:
                    "break-word"

            })

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="create-page">


            <div className="create-wrapper">


                {/* =================================================
                   TOP BAR
                ================================================= */}

                <div className="create-topbar">


                    <button
                        type="button"
                        className="back-dashboard-btn"
                        onClick={() =>
                            navigate(
                                "/citizen-dashboard"
                            )
                        }
                    >

                        ← Dashboard

                    </button>


                    <div className="create-brand">

                        <span className="brand-icon">
                            🏙️
                        </span>

                        <span>
                            Civic
                            <span>
                                Connect
                            </span>
                        </span>

                    </div>


                </div>


                {/* =================================================
                   MAIN CARD
                ================================================= */}

                <div className="complaint-container">


                    {/* =================================================
                       HEADER
                    ================================================= */}

                    <div className="form-header">


                        <div className="form-header-icon">

                            🚨

                        </div>


                        <div>

                            <div className="form-eyebrow">

                                CITIZEN SERVICE

                            </div>


                            <h1>

                                Report a Civic Issue

                            </h1>


                            <p className="subtitle">

                                Help make your city smarter,
                                cleaner and better.

                            </p>

                        </div>


                    </div>


                    {/* =================================================
                       PROGRESS
                    ================================================= */}

                    <div className="form-progress">


                        <div className="progress-item active">

                            <span>
                                1
                            </span>


                            <div>

                                <strong>
                                    Issue
                                </strong>

                                <small>
                                    Describe problem
                                </small>

                            </div>

                        </div>


                        <div className="progress-line"></div>


                        <div className="progress-item active">

                            <span>
                                2
                            </span>


                            <div>

                                <strong>
                                    Location
                                </strong>

                                <small>
                                    Where it happened
                                </small>

                            </div>

                        </div>


                        <div className="progress-line"></div>


                        <div className="progress-item active">

                            <span>
                                3
                            </span>


                            <div>

                                <strong>
                                    Submit
                                </strong>

                                <small>
                                    Send report
                                </small>

                            </div>

                        </div>


                    </div>


                    {/* =================================================
                       FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* =================================================
                           ISSUE DETAILS
                        ================================================= */}

                        <div className="form-section">


                            <div className="section-heading">


                                <div className="section-icon">
                                    📝
                                </div>


                                <div>

                                    <h2>
                                        Issue Details
                                    </h2>

                                    <p>
                                        Tell us what needs attention.
                                    </p>

                                </div>


                            </div>


                            {/* TITLE */}

                            <div className="field-group">


                                <label htmlFor="title">

                                    Complaint Title

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input

                                    id="title"

                                    className="complaint-input"

                                    name="title"

                                    placeholder="Example: Large pothole near main road"

                                    value={
                                        formData.title
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    maxLength="150"

                                    required

                                />


                            </div>


                            {/* DESCRIPTION */}

                            <div className="field-group">


                                <div className="label-row">


                                    <label htmlFor="description">

                                        Describe the Issue

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <span
                                        className={
                                            formData.description.length < 20
                                                ? "character-count warning"
                                                : "character-count"
                                        }
                                    >

                                        {
                                            formData.description.length
                                        }
                                        /500

                                    </span>


                                </div>


                                <textarea

                                    id="description"

                                    className="complaint-textarea"

                                    name="description"

                                    placeholder="Describe the problem clearly. Include important details such as what happened, how serious it is, and any nearby landmarks."

                                    value={
                                        formData.description
                                    }

                                    onChange={(e) => {

                                        if (
                                            e.target.value.length <=
                                            500
                                        ) {

                                            handleChange(e);

                                        }

                                    }}

                                    maxLength="500"

                                    required

                                />


                                <div className="field-hint">

                                    💡 Minimum 20 characters required

                                </div>


                            </div>


                            {/* CATEGORY */}

                            <div className="field-group">


                                <label>

                                    Issue Category

                                    <span>
                                        *
                                    </span>

                                </label>


                                <Select

                                    className="select-box"

                                    classNamePrefix="civic-select"

                                    options={categories}

                                    placeholder="Choose the type of civic issue"

                                    value={

                                        categories.find(
                                            x =>
                                                x.value ===
                                                formData.category
                                        ) || null

                                    }

                                    onChange={
                                        selected => {

                                            setFormData(
                                                prev => ({

                                                    ...prev,

                                                    category:
                                                        selected?.value ||
                                                        ""

                                                })
                                            );

                                        }
                                    }

                                    styles={
                                        selectStyles
                                    }

                                    menuPortalTarget={
                                        document.body
                                    }

                                    menuPosition="fixed"

                                    isSearchable={false}

                                    isClearable

                                />


                            </div>


                        </div>


                        {/* =================================================
                           LOCATION
                        ================================================= */}

                        <div className="form-section">


                            <div className="section-heading">


                                <div className="section-icon location-icon">
                                    📍
                                </div>


                                <div>

                                    <h2>
                                        Issue Location
                                    </h2>

                                    <p>
                                        Use the pincode finder or enter the address manually.
                                    </p>

                                </div>


                            </div>


                            {/* PINCODE */}

                            <div className="pincode-card">


                                <div className="pincode-card-icon">
                                    🔎
                                </div>


                                <div className="pincode-card-content">

                                    <strong>
                                        Quick Address Finder
                                    </strong>

                                    <span>
                                        Pincode lookup provides a suggestion only.
                                        Please verify and correct the address below.
                                    </span>

                                </div>


                                <div className="pincode-box">


                                    <input

                                        className="complaint-input"

                                        name="pincode"

                                        placeholder="6-digit Pincode"

                                        value={
                                            formData.pincode
                                        }

                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                    .slice(
                                                        0,
                                                        6
                                                    );


                                            setFormData(
                                                prev => ({

                                                    ...prev,

                                                    pincode:
                                                        value

                                                })
                                            );

                                        }}

                                        maxLength="6"

                                        inputMode="numeric"

                                    />


                                    <button

                                        type="button"

                                        onClick={
                                            searchPincode
                                        }

                                        className="pin-btn"

                                    >

                                        Find

                                    </button>


                                </div>


                            </div>


                            {/* MANUAL NOTE */}

                            <div className="field-hint manual-address-hint">

                                ✏️ You can manually select or create
                                State, District and City entries.
                                This is useful when the pincode suggestion
                                is incorrect or unavailable.

                            </div>


                            {/* STATE */}

                            <div className="field-group">


                                <label>

                                    State

                                    <span>
                                        *
                                    </span>

                                </label>


                                <CreatableSelect

                                    className="select-box"

                                    classNamePrefix="civic-select"

                                    options={states}

                                    placeholder="Select or type your state"

                                    value={
                                        selectedState
                                    }

                                    onChange={(selected) => {

                                        setSelectedState(
                                            selected
                                        );


                                        setSelectedDistrict(
                                            null
                                        );


                                        setSelectedCity(
                                            null
                                        );


                                        setDistrictOptions(
                                            []
                                        );


                                        setCityOptions(
                                            []
                                        );


                                        setFormData(
                                            prev => ({

                                                ...prev,

                                                state:
                                                    selected?.value ||
                                                    "",

                                                district:
                                                    "",

                                                city:
                                                    ""

                                            })
                                        );


                                        if (
                                            selected?.value
                                        ) {

                                            getDistricts(
                                                selected.value
                                            );

                                        }

                                    }}

                                    onCreateOption={
                                        handleCreateState
                                    }

                                    styles={
                                        selectStyles
                                    }

                                    menuPortalTarget={
                                        document.body
                                    }

                                    menuPosition="fixed"

                                    isSearchable

                                    isClearable

                                    formatCreateLabel={
                                        inputValue =>
                                            `Use "${inputValue}"`
                                    }

                                />


                                <div className="field-hint">

                                    Type your own state and press Enter
                                    if it is not available in the list.

                                </div>


                            </div>


                            {/* DISTRICT + CITY */}

                            <div className="location-grid">


                                {/* DISTRICT */}

                                <div className="field-group">


                                    <label>

                                        District

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <CreatableSelect

                                        className="select-box"

                                        classNamePrefix="civic-select"

                                        options={
                                            districtOptions
                                        }

                                        placeholder={

                                            selectedState
                                                ? "Select or type district"
                                                : "Select state first"

                                        }

                                        value={
                                            selectedDistrict
                                        }

                                        onChange={
                                            selected => {

                                                setSelectedDistrict(
                                                    selected
                                                );


                                                setFormData(
                                                    prev => ({

                                                        ...prev,

                                                        district:
                                                            selected?.value ||
                                                            ""

                                                    })
                                                );

                                            }
                                        }

                                        onCreateOption={
                                            handleCreateDistrict
                                        }

                                        styles={
                                            selectStyles
                                        }

                                        menuPortalTarget={
                                            document.body
                                        }

                                        menuPosition="fixed"

                                        isDisabled={
                                            !selectedState
                                        }

                                        isSearchable

                                        isClearable

                                        formatCreateLabel={
                                            inputValue =>
                                                `Use "${inputValue}"`
                                        }

                                    />


                                    <div className="field-hint">

                                        Type a district manually
                                        if the correct one is not listed.

                                    </div>


                                </div>


                                {/* CITY */}

                                <div className="field-group">


                                    <label>

                                        City / Town

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <CreatableSelect

                                        className="select-box"

                                        classNamePrefix="civic-select"

                                        options={
                                            cityOptions
                                        }

                                        placeholder="Search or type city"

                                        value={
                                            selectedCity
                                        }

                                        /*
                                         * IMPORTANT FIX:
                                         * Do NOT use:
                                         *
                                         * onInputChange={searchCity}
                                         *
                                         * because searchCity is async.
                                         */

                                        onInputChange={
                                            handleCityInputChange
                                        }

                                        onChange={
                                            selected => {

                                                setSelectedCity(
                                                    selected
                                                );


                                                setFormData(
                                                    prev => ({

                                                        ...prev,

                                                        city:
                                                            selected?.value ||
                                                            ""

                                                    })
                                                );

                                            }
                                        }

                                        onCreateOption={
                                            handleCreateCity
                                        }

                                        styles={
                                            selectStyles
                                        }

                                        menuPortalTarget={
                                            document.body
                                        }

                                        menuPosition="fixed"

                                        isSearchable

                                        isClearable

                                        formatCreateLabel={
                                            inputValue =>
                                                `Use "${inputValue}"`
                                        }

                                    />


                                    <div className="field-hint">

                                        Search for a city or type your
                                        own city and press Enter.

                                    </div>


                                </div>


                            </div>


                            {/* STREET */}

                            <div className="field-group">


                                <label htmlFor="street">

                                    Street / Area / Landmark

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input

                                    id="street"

                                    className="complaint-input"

                                    name="street"

                                    placeholder="Example: Near RTC Complex, Main Road"

                                    value={
                                        formData.street
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    maxLength="200"

                                    required

                                />


                                <div className="field-hint">

                                    Enter the exact street, area, landmark,
                                    building, or nearby location.

                                </div>


                            </div>


                        </div>


                        {/* =================================================
                           IMAGE
                        ================================================= */}

                        <div className="form-section">


                            <div className="section-heading">


                                <div className="section-icon image-icon">
                                    📷
                                </div>


                                <div>

                                    <h2>
                                        Add Evidence
                                    </h2>

                                    <p>
                                        A photo can help authorities understand
                                        the issue faster.
                                    </p>

                                </div>


                            </div>


                            <label className="upload-area">


                                <input

                                    type="file"

                                    accept="image/*"

                                    onChange={
                                        handleImage
                                    }

                                />


                                <div className="upload-content">


                                    <div className="upload-icon">
                                        📸
                                    </div>


                                    <strong>
                                        Upload an image
                                    </strong>


                                    <span>
                                        Click here to choose a photo
                                    </span>


                                    <small>
                                        JPG, JPEG, PNG • Maximum 5MB
                                    </small>


                                </div>


                            </label>


                            {/* PREVIEW */}

                            {preview && (

                                <div className="image-preview">


                                    <div className="preview-header">


                                        <div>

                                            <strong>
                                                Selected Image
                                            </strong>

                                            <span>
                                                {image?.name}
                                            </span>

                                        </div>


                                        <button

                                            type="button"

                                            onClick={
                                                removeImage
                                            }

                                            className="remove-image-btn"

                                        >

                                            ✕ Remove

                                        </button>


                                    </div>


                                    <img

                                        src={preview}

                                        alt="Complaint preview"

                                    />


                                </div>

                            )}


                        </div>


                        {/* =================================================
                           SUCCESS
                        ================================================= */}

                        {message && (

                            <div className="success-message">


                                <div className="success-icon">
                                    ✓
                                </div>


                                <div>

                                    <strong>
                                        Complaint Submitted!
                                    </strong>


                                    <span>
                                        Redirecting you to your dashboard...
                                    </span>

                                </div>


                            </div>

                        )}


                        {/* =================================================
                           SUBMIT
                        ================================================= */}

                        <div className="submit-area">


                            <div className="submit-note">


                                <span>
                                    🔒
                                </span>


                                <p>
                                    Your complaint will be securely
                                    submitted to CivicConnect.
                                </p>


                            </div>


                            <button

                                type="submit"

                                className="complaint-button"

                                disabled={
                                    loading
                                }

                            >


                                {loading ? (

                                    <>

                                        <span className="button-spinner"></span>

                                        Submitting Complaint...

                                    </>

                                ) : (

                                    <>

                                        Submit Complaint

                                        <span className="submit-arrow">
                                            →
                                        </span>

                                    </>

                                )}


                            </button>


                        </div>


                    </form>


                </div>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <p className="create-footer">

                    CivicConnect • Building smarter communities together 🏙️

                </p>


            </div>


        </div>

    );

}


export default CreateComplaint;