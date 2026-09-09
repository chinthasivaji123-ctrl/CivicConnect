import "./ComplaintTimeline.css";


function ComplaintTimeline({ history = [] }) {


    const getStatusIcon = (status) => {


        switch(status){


            case "Pending":

                return "⏳";


            case "In Progress":

                return "🚧";


            case "Resolved":

                return "✅";


            default:

                return "📌";

        }


    };




    const formatDate = (date)=>{


        if(!date) return "Date unavailable";


        return new Date(date)
        .toLocaleDateString(

            "en-IN",

            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }

        );


    };





    if(history.length === 0){


        return(

            <div className="empty-timeline">

                <span>
                    📌
                </span>

                <p>
                    No progress updates available yet
                </p>


            </div>

        );


    }





    return(


        <div className="timeline">


            {

            history.map((item,index)=>(


                <div

                className={

                `timeline-item ${
                    index === history.length-1
                    ?
                    "active"
                    :
                    ""
                }`

                }

                key={index}

                >




                    {/* LINE DOT */}

                    <div className="timeline-dot">


                        {
                            getStatusIcon(
                                item.status
                            )
                        }


                    </div>





                    {/* CONTENT */}


                    <div className="timeline-content">



                        <h4>

                            {
                                item.status
                            }


                        </h4>



                        <p>


                            {
                                formatDate(
                                    item.date
                                )
                            }


                        </p>





                        {

                        item.message &&

                        <span className="timeline-message">

                            {
                                item.message
                            }

                        </span>

                        }



                    </div>





                </div>


            ))

            }



        </div>


    );


}



export default ComplaintTimeline;