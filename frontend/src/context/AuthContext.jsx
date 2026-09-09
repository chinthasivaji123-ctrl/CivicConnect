/* =====================================================
   CIVICCONNECT AUTH CONTEXT
   GLOBAL USER AUTHENTICATION MANAGEMENT
===================================================== */


import {
    createContext,
    useState,
    useEffect
} from "react";



export const AuthContext = createContext();





function AuthProvider({children}){



const [user,setUser] = useState(null);



const [loading,setLoading] = useState(true);







// =====================================
// LOAD USER FROM LOCAL STORAGE
// =====================================


useEffect(()=>{


const savedUser = localStorage.getItem("user");



if(savedUser){

    setUser(
        JSON.parse(savedUser)
    );

}



setLoading(false);



},[]);









// =====================================
// LOGIN
// =====================================


function login(userData){



setUser(userData);



localStorage.setItem(

"user",

JSON.stringify(userData)

);



}








// =====================================
// LOGOUT
// =====================================


function logout(){



setUser(null);



localStorage.removeItem("user");



localStorage.removeItem("token");



}








return(


<AuthContext.Provider


value={{

    user,

    login,

    logout,

    loading

}}


>


{children}


</AuthContext.Provider>



);


}



export default AuthProvider;