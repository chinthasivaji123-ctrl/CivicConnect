import axios from "axios";



// =====================================================
// AXIOS INSTANCE
// =====================================================


const API = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api",


    headers: {

        "Content-Type":
            "application/json"

    },


    timeout:10000

});







// =====================================================
// REQUEST INTERCEPTOR
// ADD JWT TOKEN AUTOMATICALLY
// =====================================================


API.interceptors.request.use(


    (config)=>{


        const token =
            localStorage.getItem(
                "token"
            );



        if(token){


            config.headers.Authorization =
                `Bearer ${token}`;


        }



        return config;


    },


    (error)=>{


        return Promise.reject(error);


    }


);









// =====================================================
// RESPONSE INTERCEPTOR
// GLOBAL ERROR HANDLING
// =====================================================


API.interceptors.response.use(



    (response)=>{


        return response;


    },




    (error)=>{



        if(error.response){



            console.log(

                "API ERROR:",

                error.response.status,

                error.response.data

            );





            // =====================================
            // TOKEN EXPIRED OR INVALID
            // =====================================


            if(
                error.response.status === 401
            ){



                console.log(
                    "Session expired. Logging out..."
                );



                localStorage.removeItem(
                    "token"
                );


                localStorage.removeItem(
                    "user"
                );



                window.location.href =
                    "/login";


            }





        }

        else if(error.request){



            console.log(

                "SERVER NOT REACHABLE"

            );



        }


        else{


            console.log(

                "REQUEST ERROR:",

                error.message

            );


        }



        return Promise.reject(error);



    }



);






export default API;