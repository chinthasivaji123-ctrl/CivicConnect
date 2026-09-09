import { useNavigate } from "react-router-dom";

import "./NotFound.css";


function NotFound(){

    const navigate = useNavigate();


    return(

        <div className="notfound-page">


            <h1>
                404
            </h1>


            <h2>
                Page Not Found
            </h2>


            <p>
                The page you are looking for does not exist.
            </p>



            <button
            onClick={()=>navigate("/")}
            >

                Go Home

            </button>


        </div>

    );

}


export default NotFound;