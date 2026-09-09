import "./Footer.css";

import {
    Link
} from "react-router-dom";


function Footer(){


return(

<footer className="footer">


{/* BRAND */}

<div className="footer-section footer-brand">


<h2>
🏙️ CivicConnect
</h2>


<p>

A Digital Citizen Complaint Reporting and 
Resolution Management System that connects 
citizens and authorities for faster issue resolution.

</p>


<div className="social-links">


<a href="#">
🌐
</a>


<a href="#">
💻
</a>


<a href="#">
📧
</a>


</div>


</div>





{/* FEATURES */}


<div className="footer-section">


<h3>
Platform Features
</h3>


<ul>


<li>
📝 Smart Complaint Reporting
</li>


<li>
📊 Admin Dashboard Management
</li>


<li>
🔔 Real-Time Notifications
</li>


<li>
📍 Location Based Tracking
</li>


<li>
✅ Complaint Status Monitoring
</li>


</ul>


</div>





{/* QUICK LINKS */}


<div className="footer-section">


<h3>
Quick Links
</h3>


<ul>


<li>
<Link to="/">
Home
</Link>
</li>


<li>
<Link to="/create-complaint">
Report Complaint
</Link>
</li>


<li>
<Link to="/citizen-dashboard">
Citizen Dashboard
</Link>
</li>


<li>
<Link to="/admin-dashboard">
Admin Dashboard
</Link>
</li>


<li>
Contact Support
</li>


</ul>


</div>







{/* DEVELOPER */}


<div className="footer-section footer-developer">


<h3>
Developed By
</h3>


<h4>
Sivaji Chintha
</h4>


<p>
B.Tech Artificial Intelligence 
and Machine Learning
</p>


<p>
🚀 Full Stack Developer
</p>


<p>
Building Digital Solutions 
for Smart Communities
</p>


</div>








{/* BOTTOM */}


<div className="footer-bottom">


<p>

© 2026 CivicConnect.
All Rights Reserved.

</p>


<p>

Connecting Citizens,
Empowering Communities.

</p>


</div>



</footer>


);


}


export default Footer;