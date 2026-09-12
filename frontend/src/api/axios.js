import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api",

    timeout: 10000
});

API.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        /*
         * IMPORTANT
         *
         * Do NOT set:
         *
         * Content-Type: application/json
         *
         * here.
         *
         * When FormData is sent, the browser/Axios
         * will automatically create:
         *
         * multipart/form-data; boundary=...
         */

        return config;

    },

    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        if (error.response) {

            console.log(
                "API ERROR:",
                error.response.status,
                error.response.data
            );

            if (
                error.response.status === 401
            ) {

                console.log(
                    "Session expired. Logging out..."
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href =
                    "/login";
            }

        }

        else if (error.request) {

            console.log(
                "SERVER NOT REACHABLE"
            );

        }

        else {

            console.log(
                "REQUEST ERROR:",
                error.message
            );

        }

        return Promise.reject(error);
    }
);

export default API;