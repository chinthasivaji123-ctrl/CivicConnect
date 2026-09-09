import { 
    useEffect, 
    useState 
} from "react";


import { 
    useNavigate 
} from "react-router-dom";


import API from "../api/axios";


import "./NotificationBell.css";





function NotificationBell(){



    const navigate = useNavigate();



    const [notifications,setNotifications] = useState([]);


    const [show,setShow] = useState(false);


    const [loading,setLoading] = useState(false);








    // =================================================
    // FETCH NOTIFICATIONS
    // =================================================


    const fetchNotifications = async()=>{


        try{


            setLoading(true);



            const response = await API.get(

                "/notifications"

            );



            setNotifications(

                response.data || []

            );


        }


        catch(error){


            console.log(

                "FETCH NOTIFICATION ERROR:",

                error

            );


        }


        finally{


            setLoading(false);


        }


    };









    useEffect(()=>{


        fetchNotifications();



        // Refresh every 30 seconds


        const interval = setInterval(()=>{


            fetchNotifications();


        },30000);



        return()=>clearInterval(interval);



    },[]);












    // =================================================
    // UNREAD COUNT
    // =================================================


    const unreadCount =

    notifications.filter(

        item=>!item.isRead

    ).length;









    // =================================================
    // MARK AS READ
    // =================================================


    const markAsRead = async(notification)=>{


        try{


            if(!notification.isRead){


                await API.put(

                    `/notifications/read/${notification._id}`

                );


            }



            setNotifications(prev=>

                prev.map(item=>

                    item._id===notification._id

                    ?

                    {
                        ...item,
                        isRead:true
                    }

                    :

                    item

                )

            );




            // Navigate to complaint details


            if(notification.complaint?._id){


                navigate(

                    `/complaint/${notification.complaint._id}`

                );


                setShow(false);


            }



        }


        catch(error){


            console.log(

                "MARK READ ERROR:",

                error

            );


        }


    };









    // =================================================
    // MARK ALL READ
    // =================================================


    const markAllRead = async()=>{


        try{


            await API.put(

                "/notifications/read-all"

            );



            setNotifications(prev=>

                prev.map(item=>

                ({

                    ...item,

                    isRead:true

                })

                )

            );


        }


        catch(error){


            console.log(

                "MARK ALL READ ERROR:",

                error

            );


        }


    };









    // =================================================
    // DELETE NOTIFICATION
    // =================================================


    const deleteNotification = async(id)=>{


        try{


            await API.delete(

                `/notifications/${id}`

            );



            setNotifications(prev=>

                prev.filter(

                    item=>item._id!==id

                )

            );


        }


        catch(error){


            console.log(

                "DELETE NOTIFICATION ERROR:",

                error

            );


        }


    };












    return(


        <div className="notification-wrapper">







            <button


            className="notification-btn"


            onClick={()=>setShow(!show)}


            >


                🔔



                {


                unreadCount > 0 &&


                <span className="notification-count">


                    {unreadCount}


                </span>


                }



            </button>









            {


            show &&



            <div className="notification-dropdown">







                <div className="notification-header">


                    <h3>

                        Notifications

                    </h3>



                    {


                    unreadCount > 0 &&


                    <button


                    className="read-all-btn"


                    onClick={markAllRead}


                    >

                        Mark all read


                    </button>


                    }



                </div>









                {


                loading ?


                (

                    <p className="notification-empty">

                        Loading...


                    </p>

                )


                :


                notifications.length===0 ?


                (

                    <p className="notification-empty">

                        No Notifications

                    </p>

                )


                :



                notifications.map((item)=>(





                    <div



                    className={

                        item.isRead

                        ?

                        "notification-item"

                        :

                        "notification-item unread"

                    }



                    key={item._id}





                    onClick={()=>markAsRead(item)}


                    >






                        <div>


                            <p>

                                {item.message}

                            </p>



                            {


                            item.complaint &&


                            <small>


                                Complaint:

                                {" "}

                                {

                                item.complaint.title

                                }



                            </small>


                            }





                            <small>


                                {


                                new Date(

                                    item.createdAt

                                )

                                .toLocaleString()


                                }


                            </small>



                        </div>







                        <button


                        className="delete-notification-btn"


                        onClick={(e)=>{


                            e.stopPropagation();


                            deleteNotification(

                                item._id

                            );


                        }}



                        >


                            🗑


                        </button>







                    </div>





                ))


                }





            </div>


            }





        </div>


    );



}




export default NotificationBell;