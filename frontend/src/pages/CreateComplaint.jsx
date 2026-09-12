import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import Select from "react-select";

import API from "../api/axios";

import "./CreateComplaint.css";


function CreateComplaint() {


    const navigate = useNavigate();


    // Prevent the mobile page from opening or retaining a horizontal
    // scroll position. This keeps the complaint form anchored to the
    // left edge of the viewport on phones.
    useEffect(() => {

        const html = document.documentElement;
        const body = document.body;
        const root = document.getElementById("root");

        const previousHtmlOverflowX = html.style.overflowX;
        const previousBodyOverflowX = body.style.overflowX;
        const previousRootOverflowX = root
            ? root.style.overflowX
            : "";

        html.style.overflowX = "hidden";
        body.style.overflowX = "hidden";

        if (root) {
            root.style.overflowX = "hidden";
        }

        window.scrollTo({
            left: 0,
            top: window.scrollY
        });

        return () => {

            html.style.overflowX = previousHtmlOverflowX;
            body.style.overflowX = previousBodyOverflowX;

            if (root) {
                root.style.overflowX = previousRootOverflowX;
            }

        };

    }, []);


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


    const [formData, setFormData] = useState(initialForm);


    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState(null);


    const [states, setStates] = useState([]);

    const [districtOptions, setDistrictOptions] = useState([]);

    const [cityOptions, setCityOptions] = useState([]);


    const [selectedState, setSelectedState] = useState(null);

    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [selectedCity, setSelectedCity] = useState(null);


    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");



    // ================= CATEGORY =================

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



    // ================= LOAD STATES =================

    useEffect(() => {

        const loadStates = async () => {

            try {

                const res = await API.get(
                    "/location/states"
                );

                setStates(
                    res.data.map(item => ({
                        value: item,
                        label: item
                    }))
                );

            }
            catch (err) {

                console.log(
                    "LOAD STATES ERROR:",
                    err
                );

            }

        };


        loadStates();

    }, []);



    // ================= INPUT =================

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



    // ================= IMAGE =================

    const handleImage = (e) => {

        const file = e.target.files[0];


        if (!file) {

            return;

        }


        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Image size must be below 5MB"
            );

            e.target.value = "";

            return;

        }


        setImage(file);


        setPreview(
            URL.createObjectURL(file)
        );

    };



    const removeImage = () => {

        setImage(null);

        setPreview(null);

    };



    // ================= DISTRICT =================

    const getDistricts = async (state) => {

        try {

            const res = await API.get(
                `/location/districts/${state}`
            );


            setDistrictOptions(

                res.data.map(item => ({

                    value: item,
                    label: item

                }))

            );

        }
        catch (err) {

            console.log(
                "LOAD DISTRICTS ERROR:",
                err
            );

            setDistrictOptions([]);

        }

    };



    // ================= CITY =================

    const searchCity = async (value) => {

        if (!value || value.length < 2) {

            return;

        }


        try {

            const res = await API.get(
                `/location/search/${value}`
            );


            setCityOptions(

                res.data.map(item => ({

                    value: item.name,

                    label: `${item.name} (${item.district})`

                }))

            );

        }
        catch (err) {

            console.log(
                "SEARCH CITY ERROR:",
                err
            );

        }

    };



    // ================= PINCODE =================

    const searchPincode = async () => {

        if (formData.pincode.length !== 6) {

            alert(
                "Enter valid 6-digit pincode"
            );

            return;

        }


        try {

            const res = await API.get(
                `/location/pincode/${formData.pincode}`
            );


            const data = res.data;


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

                value: data.state,
                label: data.state

            };


            const districtOption = {

                value: data.district,
                label: data.district

            };


            const cityOption = {

                value: data.city,
                label: data.city

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
             * IMPORTANT:
             * Load the COMPLETE district list for the state.
             * This allows the citizen to correct a wrong district
             * returned by the pincode lookup.
             */

            await getDistricts(
                data.state
            );


            /*
             * Keep the pincode city as a suggestion.
             * The citizen can search and select another city.
             */

            setCityOptions([
                cityOption
            ]);


            setFormData(prev => ({

                ...prev,

                state: data.state,
                district: data.district,
                city: data.city

            }));


            alert(
                "Address suggestion found. Please verify the State, District and City before submitting."
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



    // ================= SUBMIT =================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.category) {

            alert(
                "Select category"
            );

            return;

        }


        if (formData.description.length < 20) {

            alert(
                "Description should contain minimum 20 characters"
            );

            return;

        }


        if (!formData.pincode || formData.pincode.length !== 6) {

            alert(
                "Enter a valid 6-digit pincode"
            );

            return;

        }


        if (!formData.state) {

            alert(
                "Select state"
            );

            return;

        }


        if (!formData.district) {

            alert(
                "Select district"
            );

            return;

        }


        if (!formData.city) {

            alert(
                "Select city"
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


            const data = new FormData();


            Object.keys(formData).forEach(key => {

                data.append(
                    key,
                    formData[key]
                );

            });


            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            await API.post(

                "/complaints/create",

                data,

                {
                    headers: {

                        "Content-Type":
                            "multipart/form-data"

                    }
                }

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



    // ================= SELECT STYLES =================

    const selectStyles = {

        control: (base, state) => ({

            ...base,

            minHeight: "56px",

            borderRadius: "15px",

            borderColor: state.isFocused
                ? "#2563eb"
                : "#dbe3ef",

            boxShadow: state.isFocused
                ? "0 0 0 4px rgba(37,99,235,.10)"
                : "none",

            backgroundColor: "#ffffff",

            cursor: "pointer",

            "&:hover": {

                borderColor: "#2563eb"

            }

        }),

        valueContainer: (base) => ({

            ...base,

            padding: "4px 15px"

        }),

        placeholder: (base) => ({

            ...base,

            color: "#94a3b8",

            fontSize: "15px"

        }),

        singleValue: (base) => ({

            ...base,

            color: "#1e293b",

            fontSize: "15px",

            fontWeight: "600"

        }),

        menu: (base) => ({

            ...base,

            borderRadius: "14px",

            overflow: "hidden",

            boxShadow:
                "0 15px 40px rgba(15,23,42,.15)",

            zIndex: 9999

        }),

        menuPortal: (base) => ({

            ...base,

            zIndex: 9999

        }),

        option: (base, state) => ({

            ...base,

            padding: "12px 15px",

            backgroundColor: state.isFocused
                ? "#eff6ff"
                : "#ffffff",

            color: "#1e293b",

            cursor: "pointer"

        })

    };



    return (

        <div className="create-page">


            {/* ================= TOP HEADER ================= */}

            <div className="create-wrapper">


                <div className="create-topbar">

                    <button
                        type="button"
                        className="back-dashboard-btn"
                        onClick={() =>
                            navigate("/citizen-dashboard")
                        }
                    >

                        ← Dashboard

                    </button>


                    <div className="create-brand">

                        <span className="brand-icon">
                            🏙️
                        </span>

                        <span>
                            Civic<span>Connect</span>
                        </span>

                    </div>

                </div>



                {/* ================= MAIN CARD ================= */}

                <div className="complaint-container">


                    {/* ================= HEADER ================= */}

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



                    {/* ================= PROGRESS ================= */}

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



                    <form onSubmit={handleSubmit}>


                        {/* ================= ISSUE DETAILS ================= */}

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

                                    value={formData.title}

                                    onChange={handleChange}

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


                                    <span className={
                                        formData.description.length < 20
                                            ? "character-count warning"
                                            : "character-count"
                                    }>

                                        {formData.description.length}
                                        /500

                                    </span>

                                </div>


                                <textarea

                                    id="description"

                                    className="complaint-textarea"

                                    name="description"

                                    placeholder="Describe the problem clearly. Include important details such as what happened, how serious it is, and any nearby landmarks."

                                    value={formData.description}

                                    onChange={(e) => {

                                        if (
                                            e.target.value.length <= 500
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

                                    options={categories}

                                    placeholder="Choose the type of civic issue"

                                    value={
                                        categories.find(
                                            x =>
                                                x.value ===
                                                formData.category
                                        ) || null
                                    }

                                    onChange={(selected) =>
                                        setFormData(prev => ({

                                            ...prev,

                                            category:
                                                selected?.value || ""

                                        }))
                                    }

                                    styles={selectStyles}

                                    menuPortalTarget={document.body}

                                    menuPosition="fixed"

                                    isSearchable={false}

                                />

                            </div>


                        </div>



                        {/* ================= LOCATION ================= */}

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



                            {/* PINCODE QUICK FIND */}

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

                                        value={formData.pincode}

                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 6);

                                            setFormData(prev => ({

                                                ...prev,

                                                pincode: value

                                            }));

                                        }}

                                        maxLength="6"

                                        inputMode="numeric"

                                    />


                                    <button

                                        type="button"

                                        onClick={searchPincode}

                                        className="pin-btn"

                                    >

                                        Find

                                    </button>

                                </div>


                            </div>



                            {/* MANUAL ADDRESS */}

                            <div className="field-hint">

                                ✏️ You can manually select or correct the address
                                fields below, even after using the pincode finder.

                            </div>



                            {/* STATE */}

                            <div className="field-group">

                                <label>

                                    State

                                    <span>
                                        *
                                    </span>

                                </label>


                                <Select

                                    className="select-box"

                                    options={states}

                                    placeholder="Select your state"

                                    value={selectedState}

                                    onChange={(selected) => {

                                        setSelectedState(selected);

                                        setSelectedDistrict(null);

                                        setSelectedCity(null);

                                        setDistrictOptions([]);

                                        setCityOptions([]);


                                        setFormData(prev => ({

                                            ...prev,

                                            state:
                                                selected?.value || "",

                                            district: "",
                                            city: ""

                                        }));


                                        if (selected?.value) {

                                            getDistricts(
                                                selected.value
                                            );

                                        }

                                    }}

                                    styles={selectStyles}

                                    menuPortalTarget={document.body}

                                    menuPosition="fixed"

                                    isSearchable

                                />

                            </div>



                            {/* DISTRICT + CITY */}

                            <div className="location-grid">


                                <div className="field-group">

                                    <label>

                                        District

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <Select

                                        className="select-box"

                                        options={districtOptions}

                                        placeholder={
                                            selectedState
                                                ? "Select or correct district"
                                                : "Select state first"
                                        }

                                        value={selectedDistrict}

                                        onChange={(selected) => {

                                            setSelectedDistrict(selected);

                                            setFormData(prev => ({

                                                ...prev,

                                                district:
                                                    selected?.value || ""

                                            }));

                                        }}

                                        styles={selectStyles}

                                        menuPortalTarget={document.body}

                                        menuPosition="fixed"

                                        isDisabled={!selectedState}

                                        isSearchable

                                    />

                                </div>



                                <div className="field-group">

                                    <label>

                                        City / Town

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <Select

                                        className="select-box"

                                        options={cityOptions}

                                        placeholder="Search or correct city"

                                        isSearchable

                                        value={selectedCity}

                                        onInputChange={
                                            searchCity
                                        }

                                        onChange={(selected) => {

                                            setSelectedCity(selected);

                                            setFormData(prev => ({

                                                ...prev,

                                                city:
                                                    selected?.value || ""

                                            }));

                                        }}

                                        styles={selectStyles}

                                        menuPortalTarget={document.body}

                                        menuPosition="fixed"

                                    />

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

                                    value={formData.street}

                                    onChange={handleChange}

                                    required

                                />

                                <div className="field-hint">

                                    Enter the exact street, area, landmark,
                                    building, or nearby location.

                                </div>

                            </div>


                        </div>



                        {/* ================= IMAGE ================= */}

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

                                    onChange={handleImage}

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



                            {/* IMAGE PREVIEW */}

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

                                            onClick={removeImage}

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



                        {/* ================= SUCCESS ================= */}

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



                        {/* ================= SUBMIT ================= */}

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

                                disabled={loading}

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



                {/* ================= FOOTER NOTE ================= */}

                <p className="create-footer">

                    CivicConnect • Building smarter communities together 🏙️

                </p>


            </div>

        </div>

    );

}


export default CreateComplaint;