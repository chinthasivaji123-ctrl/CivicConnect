/* =====================================================
   CIVICCONNECT PROTECTED ROUTE
   ROLE BASED AUTHENTICATION
===================================================== */


import { 
    useContext 
} from "react";


import { 
    Navigate 
} from "react-router-dom";


import { 
    AuthContext 
} from "../context/AuthContext";




function ProtectedRoute({
    children,
    role
}){


const {
    user,
    loading
}=useContext(AuthContext);





// ================================
// CHECK AUTH LOADING
// ================================


if(loading){

    return(

        <div className="app-loading">

            <h2>
                Loading CivicConnect...
            </h2>

        </div>

    );

}







// ================================
// USER NOT LOGGED IN
// ================================


if(!user){


    return(

        <Navigate

        to="/login"

        replace

        />

    );


}







// ================================
// ROLE CHECK
// ================================


if(
    role && 
    user.role?.toLowerCase() !== role.toLowerCase()
){


    return(

        <Navigate

        to="/"

        replace

        />

    );


}







// ================================
// ACCESS GRANTED
// ================================


return children;



}



export default ProtectedRoute;