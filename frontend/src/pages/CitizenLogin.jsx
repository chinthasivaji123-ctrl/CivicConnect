import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

import "./CitizenLogin.css";



function CitizenLogin(){


    const navigate = useNavigate();


    const {login}=useContext(AuthContext);




    const [formData,setFormData]=useState({

        email:"",
        password:""

    });





    const handleChange=(e)=>{


        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });


    };








    const handleSubmit=async(e)=>{


        e.preventDefault();



        try{


            const response = await API.post(

                "/auth/login",

                formData

            );



            const {token,user}=response.data;





            if(!token || !user){


                alert("Invalid server response");

                return;


            }







            if(user.role !== "citizen"){


                alert("Please use Citizen Login");

                return;


            }







            localStorage.setItem(

                "token",

                token

            );




            login(user);






            alert("Citizen Login Successful");





            navigate("/citizen-dashboard");





        }





        catch(error){



            console.log(error);



            alert(


                error.response?.data?.message ||

                "Login Failed"


            );



        }





    };








return(



<div className="citizen-login-container">





<div className="citizen-glow"></div>







<div className="citizen-login-card">






<div className="citizen-header">





<div className="citizen-logo">


🌐


</div>







<h1>


CivicConnect


</h1>







<h2>


Citizen Login


</h2>







<p>


Access your dashboard and manage your community complaints easily


</p>







</div>









<form onSubmit={handleSubmit}>






<input


className="citizen-input"


type="email"


name="email"


placeholder="Enter Email"


value={formData.email}


onChange={handleChange}


required


/>








<input


className="citizen-input"


type="password"


name="password"


placeholder="Enter Password"


value={formData.password}


onChange={handleChange}


required


/>









<button


className="citizen-login-button"


type="submit"


>


Login 🚀


</button>









<p className="citizen-register-text">





Don't have an account?





<span


onClick={()=>navigate("/register")}


>


Register


</span>





</p>







</form>







</div>






</div>





);



}



export default CitizenLogin;