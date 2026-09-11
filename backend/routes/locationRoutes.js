const express = require("express");

const router = express.Router();

const axios = require("axios");


// =====================================================
// PINCODE API CONFIGURATION
// =====================================================

const PINCODE_API =
    "https://api.pincodeapi.in/api/v1";


// =====================================================
// GET ALL STATES OF INDIA
// =====================================================

router.get("/states", async (req, res) => {

    try {

        const response = await axios.get(
            `${PINCODE_API}/state`,
            {
                timeout: 10000
            }
        );

        return res.status(200).json(
            response.data
        );

    }

    catch (error) {

        console.log(
            "STATE ERROR:",
            error.message
        );

        return res.status(500).json({

            message:
                "Unable to fetch states"

        });

    }

});


// =====================================================
// GET DISTRICTS BY STATE
// =====================================================

router.get("/districts/:state", async (req, res) => {

    try {

        const state =
            req.params.state;


        if (!state) {

            return res.status(400).json({

                message:
                    "State is required"

            });

        }


        const response = await axios.get(

            `${PINCODE_API}/state/${encodeURIComponent(state)}`,

            {
                timeout: 10000
            }

        );


        return res.status(200).json(

            response.data

        );

    }

    catch (error) {

        console.log(
            "DISTRICT ERROR:",
            error.message
        );


        return res.status(500).json({

            message:
                "District fetch failed"

        });

    }

});


// =====================================================
// SEARCH CITY / TOWN / VILLAGE
// =====================================================

router.get("/search/:name", async (req, res) => {

    try {

        const name =
            req.params.name;


        if (!name) {

            return res.status(400).json({

                message:
                    "Search name is required"

            });

        }


        const response = await axios.get(

            `${PINCODE_API}/search`,

            {

                params: {

                    q: name,

                    limit: 20

                },

                timeout: 10000

            }

        );


        return res.status(200).json(

            response.data

        );

    }

    catch (error) {

        console.log(

            "CITY SEARCH ERROR:",

            error.message

        );


        return res.status(500).json({

            message:
                "City search failed"

        });

    }

});


// =====================================================
// GET COMPLETE ADDRESS USING PINCODE
// =====================================================
// GET /api/location/pincode/521201
// =====================================================

router.get("/pincode/:pincode", async (req, res) => {

    try {

        const pincode =
            req.params.pincode;


        console.log(
            "PINCODE REQUEST:",
            pincode
        );


        // =================================================
        // VALIDATE PINCODE
        // =================================================

        if (!/^\d{6}$/.test(pincode)) {

            return res.status(400).json({

                message:
                    "Pincode must contain exactly 6 digits"

            });

        }


        // =================================================
        // CALL PINCODE API
        // =================================================

        console.log(
            "Calling Pincode API..."
        );


        const response = await axios.get(

            `${PINCODE_API}/pincode/${pincode}`,

            {

                timeout: 10000,

                headers: {

                    Accept:
                        "application/json"

                }

            }

        );


        console.log(
            "PINCODE API RESPONSE RECEIVED"
        );


        const apiData =
            response.data;


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (

            !apiData ||

            apiData.success !== true ||

            !apiData.data ||

            !apiData.data.post_offices ||

            apiData.data.post_offices.length === 0

        ) {

            console.log(
                "PINCODE NOT FOUND:",
                pincode
            );


            return res.status(404).json({

                message:
                    "Invalid Pincode"

            });

        }


        // =================================================
        // GET FIRST POST OFFICE
        // =================================================

        const postOffice =
            apiData.data.post_offices[0];


        console.log(
            "POST OFFICE:",
            postOffice
        );


        // =================================================
        // SEND SAME FORMAT EXPECTED BY FRONTEND
        // =================================================

        return res.status(200).json({

            state:
                postOffice.state,

            district:
                postOffice.district,

            city:
                postOffice.office_name,

            division:
                postOffice.division || "",

            pincode:
                postOffice.pincode

        });

    }

    catch (error) {

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "PINCODE ERROR"
        );
        console.log(
            "========================================"
        );

        console.log(
            "Pincode:",
            req.params.pincode
        );

        console.log(
            "Error:",
            error.message
        );

        if (error.response) {

            console.log(
                "HTTP STATUS:",
                error.response.status
            );

            console.log(
                "API RESPONSE:",
                error.response.data
            );

        }

        console.log(
            "========================================"
        );


        // =================================================
        // TIMEOUT
        // =================================================

        if (
            error.code ===
            "ECONNABORTED"
        ) {

            return res.status(504).json({

                message:
                    "Pincode service timed out. Please enter the address manually."

            });

        }


        return res.status(500).json({

            message:
                "Pincode search failed"

        });

    }

});


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;