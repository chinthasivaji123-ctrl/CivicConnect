import API from "../api/axios";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../components/InputField";

import "./Register.css";


function Register(){

const navigate = useNavigate();


const [user,setUser] = useState({

    name:"",
    mobile:"",
    email:"",
    password:""

});



function handleChange(e){

    setUser({

        ...user,

        [e.target.name]:e.target.value

    });

}




async function handleSubmit(e){

e.preventDefault();


try{


const response = await API.post(

"/auth/register",

{

name:user.name,
mobile:user.mobile,
email:user.email,
password:user.password

}

);



console.log(response.data);



alert("Registration successful");


navigate("/login");



setUser({

name:"",
mobile:"",
email:"",
password:""

});



}


catch(error){


console.log(error);


alert(

error.response?.data?.message ||

"Registration failed"

);


}



}





return(

<div className="register-container">


<div className="register-glow"></div>



<div className="register-card">



<div className="register-header">


<div className="logo">

🏙️

</div>


<h1>

SmartTown

</h1>


<h2>

Create Account

</h2>


<p>

Join your digital community platform

</p>


</div>




<form

onSubmit={handleSubmit}

className="register-form"

>




<InputField

type="text"

name="name"

placeholder="Full Name"

value={user.name}

onChange={handleChange}

/>





<InputField

type="text"

name="mobile"

placeholder="Mobile Number"

value={user.mobile}

onChange={handleChange}

/>





<InputField

type="email"

name="email"

placeholder="Email Address"

value={user.email}

onChange={handleChange}

/>





<InputField

type="password"

name="password"

placeholder="Create Password"

value={user.password}

onChange={handleChange}

/>




<button

type="submit"

className="register-button"

>

Create Account 🚀

</button>




<p className="login-text">


Already have an account?


<span

onClick={()=>navigate("/login")}

>

 Login

</span>


</p>



</form>




</div>



</div>


)


}


export default Register;