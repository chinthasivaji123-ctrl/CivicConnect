import "./CitizenImpact.css";


function CitizenImpact({

    total = 0,

    resolved = 0,

    pending = 0

}) {



const impactScore =
(resolved * 10) +
(total * 5);



const resolutionRate =

total > 0

?

Math.round(
(resolved / total) * 100
)

:

0;



const citizenLevel =

impactScore >= 500

?

"🌟 City Champion"

:

impactScore >= 200

?

"⭐ Community Builder"

:

"🌱 Active Citizen";





return (

<section className="citizen-impact">





{/* HEADER */}



<div className="impact-header">



<div className="impact-content">


<span className="impact-badge">

🌍 COMMUNITY IMPACT

</span>




<h2>

Your Contribution
Creates A Smarter City

</h2>



<p>

Every complaint you report helps authorities
build a cleaner, safer and smarter community.

</p>



<div className="citizen-level">

🏆 {citizenLevel}

</div>


</div>







{/* SCORE */}



<div className="impact-score">


<div className="score-circle">


<strong>

{impactScore}

</strong>


<span>

Civic Points

</span>


</div>



</div>



</div>









{/* STAT CARDS */}



<div className="impact-cards">





<div className="impact-card blue">


<div className="impact-icon">

📋

</div>


<h3>

{total}

</h3>


<p>

Reports Submitted

</p>


</div>







<div className="impact-card green">


<div className="impact-icon">

✅

</div>


<h3>

{resolved}

</h3>


<p>

Problems Solved

</p>


</div>







<div className="impact-card orange">


<div className="impact-icon">

⏳

</div>


<h3>

{pending}

</h3>


<p>

Active Issues

</p>


</div>






</div>









{/* PROGRESS */}



<div className="impact-progress">


<div className="progress-header">


<h3>

City Improvement Progress

</h3>



<span>

{resolutionRate}%

</span>



</div>






<div className="progress-track">


<div

className="progress-fill"

style={{

width:`${resolutionRate}%`

}}

/>


</div>




<p>

Your reports are helping improve
the city response system 🚀

</p>



</div>









{/* FEATURES */}



<div className="impact-features">





<div>

🌱

<span>

Cleaner City

</span>

</div>






<div>

⚡

<span>

Fast Response

</span>

</div>







<div>

🏙️

<span>

Smart Community

</span>

</div>






</div>





</section>


);


}


export default CitizenImpact;