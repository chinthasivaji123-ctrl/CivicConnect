import {
    useState,
    useContext
} from "react";

import {
    useNavigate
} from "react-router-dom";


import {
    AuthContext
} from "../context/AuthContext";


import API from "../api/axios";


import "./AdminLogin.css";



function AdminLogin(){


    const navigate = useNavigate();


    const {login}=useContext(AuthContext);



    const [formData,setFormData]=useState({

        email:"",
        password:""

    });



    const [loading,setLoading]=useState(false);





    const handleChange=(e)=>{


        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });


    };







    const handleSubmit=async(e)=>{


        e.preventDefault();



        try{


            setLoading(true);



            const response = await API.post(

                "/auth/login",

                formData

            );




            const {token,user}=response.data;





            if(!token || !user){


                alert(
                    "Invalid server response"
                );

                return;

            }






            if(user.role !== "admin"){


                alert(
                    "Access denied. Admin only"
                );

                return;

            }





            localStorage.setItem(

                "token",

                token

            );



            login(user);




            alert(

                "Admin Login Successful"

            );




            navigate(

                "/admin-dashboard"

            );



        }



        catch(error){



            console.log(error);



            alert(

                error.response?.data?.message ||

                "Login Failed"

            );


        }




        finally{


            setLoading(false);


        }




    };








    return(



        <div className="admin-page">



            <div className="floating-circle circle-one"></div>

            <div className="floating-circle circle-two"></div>





            <div className="admin-wrapper">






                <div className="admin-info">





                    <div className="city-icon">

                        🏙️

                    </div>





                    <h1>

                        CivicConnect

                    </h1>





                    <h3>

                        Digital City Management System

                    </h3>





                    <p>

                        Empowering administrators to manage

                        citizen complaints and improve

                        public services efficiently.

                    </p>






                    <div className="secure-box">


                        🔒 Secure Admin Access


                    </div>




                </div>









                <div className="admin-login-card">





                    <div className="admin-header">





                        <div className="admin-logo">


                            🛡️


                        </div>





                        <h2>

                            Admin Portal

                        </h2>






                    </div>









                    <form onSubmit={handleSubmit}>


                        <div className="input-box">


                            <span>

                                📧

                            </span>



                            <input


                                type="email"


                                name="email"


                                placeholder="Admin Email"


                                value={formData.email}


                                onChange={handleChange}


                                required


                            />


                        </div>









                        <div className="input-box">


                            <span>

                                🔑

                            </span>




                            <input


                                type="password"


                                name="password"


                                placeholder="Password"


                                value={formData.password}


                                onChange={handleChange}


                                required


                            />


                        </div>









                        <button


                            className="admin-login-button"


                            disabled={loading}


                        >



                            {


                                loading

                                ?

                                "Authenticating..."

                                :

                                "Login as Admin 🚀"


                            }



                        </button>









                        <p className="back-text">


                            Back to



                            <span

                                onClick={()=>navigate("/login")}

                            >


                                Login Portal


                            </span>



                        </p>





                    </form>






                </div>







            </div>





        </div>



    );


}



export default AdminLogin;