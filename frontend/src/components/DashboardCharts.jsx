import {
    Pie,
    Bar
} from "react-chartjs-2";


import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from "chart.js";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);





function DashboardCharts({complaints}){



    // ==========================
    // STATUS COUNT
    // ==========================


    const pending = complaints.filter(
        (c)=>c.status==="Pending"
    ).length;



    const progress = complaints.filter(
        (c)=>c.status==="In Progress"
    ).length;



    const resolved = complaints.filter(
        (c)=>c.status==="Resolved"
    ).length;







    const pieData = {


        labels:[

            "Pending",

            "In Progress",

            "Resolved"

        ],



        datasets:[

            {

                label:"Complaints",

                data:[

                    pending,

                    progress,

                    resolved

                ],


                backgroundColor:[

                    "#ff9800",

                    "#2196f3",

                    "#4caf50"

                ],


                borderWidth:1

            }

        ]

    };









    // ==========================
    // CATEGORY COUNT
    // ==========================


    const categories={};



    complaints.forEach((complaint)=>{


        const category = complaint.category;



        if(categories[category]){


            categories[category]++;


        }

        else{


            categories[category]=1;


        }


    });







    const barData={


        labels:Object.keys(categories),



        datasets:[

            {

                label:"Complaints By Category",


                data:Object.values(categories),



                backgroundColor:[

                    "#673ab7",

                    "#03a9f4",

                    "#009688",

                    "#ff5722",

                    "#e91e63"

                ],



                borderWidth:1

            }

        ]

    };








    const chartOptions={


        responsive:true,


        maintainAspectRatio:false,


        plugins:{


            legend:{


                position:"bottom"


            },


            title:{


                display:true,


                font:{


                    size:18


                }


            }


        }


    };









    return(



        <div className="charts-container">







            <div className="chart-box">


                <h3>

                    Complaint Status

                </h3>



                <div className="chart-size">

                    <Pie

                        data={pieData}

                        options={chartOptions}

                    />

                </div>


            </div>









            <div className="chart-box">


                <h3>

                    Complaints By Category

                </h3>




                <div className="chart-size">

                    <Bar

                        data={barData}

                        options={chartOptions}

                    />

                </div>



            </div>






        </div>



    );


}





export default DashboardCharts;