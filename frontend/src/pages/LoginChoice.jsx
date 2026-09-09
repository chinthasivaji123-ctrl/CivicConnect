import { useNavigate } from "react-router-dom";

import "./LoginChoice.css";


function LoginChoice(){


const navigate = useNavigate();



return(


<div className="login-choice-container">





<div className="login-choice-box">






{/* LEFT INFORMATION SECTION */}



<div className="login-info">





<div className="logo-icon">

🌐

</div>







<h1>

CivicConnect

</h1>






<h3>

Smart Citizen Service Portal

</h3>







<p>

Connecting citizens and administrators
for a smarter community

</p>









<div className="features">



<div>

✓ Easy Complaint Reporting

</div>



<div>

✓ Real-Time Complaint Tracking

</div>



<div>

✓ Transparent Smart City Management

</div>



</div>






</div>









{/* RIGHT LOGIN SECTION */}



<div className="login-section">





<h2>

Choose Your Login

</h2>







<p className="login-subtitle">

Select your role to continue

</p>









<div className="login-cards">







{/* CITIZEN */}



<div className="login-card citizen-card">





<div className="role-icon">

👤

</div>







<h3>

Citizen Login

</h3>







<p>

Report public issues,
track complaints and
get updates easily.

</p>







<button

onClick={()=>navigate("/citizen-login")}

>

Login as Citizen

</button>






</div>









{/* ADMIN */}



<div className="login-card admin-card">





<div className="role-icon">

🛡️

</div>







<h3>

Admin Login

</h3>







<p>

Manage complaints,
monitor services and
resolve issues.

</p>








<button

onClick={()=>navigate("/admin-login")}

>

Login as Admin

</button>






</div>







</div>







</div>








</div>





</div>



)



}



export default LoginChoice;