import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import "./App.css";


// COMPONENTS
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


// PAGES

import Home from "./pages/Home";


// AUTH
import LoginChoice from "./pages/LoginChoice";
import CitizenLogin from "./pages/CitizenLogin";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";


// DASHBOARDS
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";


// COMPLAINT
import CreateComplaint from "./pages/CreateComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
import CitizenComplaintDetails from "./pages/CitizenComplaintDetails";


// PROFILE
import Profile from "./pages/Profile";


// 404
import NotFound from "./pages/NotFound";



function App(){


return(

<BrowserRouter>


<div className="app">


<Navbar />



<main className="app-main">


<Routes>


{/* ================= PUBLIC ================= */}


<Route
path="/"
element={<Home />}
/>


<Route
path="/login"
element={<LoginChoice />}
/>


<Route
path="/citizen-login"
element={<CitizenLogin />}
/>


<Route
path="/admin-login"
element={<AdminLogin />}
/>


<Route
path="/register"
element={<Register />}
/>





{/* ================= CITIZEN ================= */}



<Route

path="/citizen-dashboard"

element={

<ProtectedRoute role="citizen">

<CitizenDashboard />

</ProtectedRoute>

}

/>



<Route

path="/create-complaint"

element={

<ProtectedRoute role="citizen">

<CreateComplaint />

</ProtectedRoute>

}

/>



<Route

path="/citizen-complaint/:id"

element={

<ProtectedRoute role="citizen">

<CitizenComplaintDetails />

</ProtectedRoute>

}

/>






{/* ================= ADMIN ================= */}



<Route

path="/admin-dashboard"

element={

<ProtectedRoute role="admin">

<AdminDashboard />

</ProtectedRoute>

}

/>



<Route

path="/complaint/:id"

element={

<ProtectedRoute role="admin">

<ComplaintDetails />

</ProtectedRoute>

}

/>






{/* ================= PROFILE ================= */}



<Route

path="/profile"

element={

<ProtectedRoute>

<Profile />

</ProtectedRoute>

}

/>







{/* ================= 404 ================= */}



<Route

path="/404"

element={<NotFound />}

/>



<Route

path="*"

element={<Navigate to="/404" replace />}

/>



</Routes>


</main>


</div>


</BrowserRouter>


);

}


export default App;