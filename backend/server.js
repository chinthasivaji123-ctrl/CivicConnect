// =====================================================
// ENVIRONMENT CONFIGURATION
// =====================================================

require("dotenv").config();

console.log(
    "JWT_SECRET STATUS:",
    process.env.JWT_SECRET
        ? "LOADED"
        : "NOT LOADED"
);

// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const helmet = require("helmet");
const morgan = require("morgan");



// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");

const complaintRoutes = require("./routes/complaintRoutes");

const locationRoutes = require("./routes/locationRoutes");

const profileRoutes = require("./routes/profileRoutes");

const notificationRoutes = require("./routes/notificationRoutes");



// =====================================================
// APP INITIALIZATION
// =====================================================

const app = express();




// =====================================================
// SECURITY MIDDLEWARE
// =====================================================

app.use(

    helmet({

        crossOriginResourcePolicy:false

    })

);


app.use(

    morgan("dev")

);




// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);

// =====================================================
// BODY PARSER
// =====================================================


app.use(

    express.json({

        limit:"10mb"

    })

);



app.use(

    express.urlencoded({

        extended:true,

        limit:"10mb"

    })

);




// =====================================================
// STATIC FILES
// =====================================================


app.use(

    "/uploads",

    express.static(

        path.join(

            __dirname,

            "uploads"

        )

    )

);




// =====================================================
// API ROUTES
// =====================================================


app.use(

    "/api/auth",

    authRoutes

);



app.use(

    "/api/complaints",

    complaintRoutes

);



app.use(

    "/api/location",

    locationRoutes

);



app.use(

    "/api/profile",

    profileRoutes

);



app.use(

    "/api/notifications",

    notificationRoutes

);




// =====================================================
// TEST ROUTES
// =====================================================


app.get("/",(req,res)=>{


    res.json({

        success:true,

        message:"SmartTown Backend Running"

    });


});




app.get("/api/health",(req,res)=>{


    res.json({

        success:true,

        server:"Running",

        database:

        mongoose.connection.readyState === 1

        ?

        "Connected"

        :

        "Disconnected"

    });


});




// =====================================================
// ERROR HANDLER
// =====================================================


app.use(

(err,req,res,next)=>{


    console.log(

        "SERVER ERROR:",

        err

    );


    res.status(500).json({

        success:false,

        message:"Internal Server Error"

    });


}

);




// =====================================================
// INVALID ROUTE
// =====================================================


app.use(

(req,res)=>{


    res.status(404).json({

        success:false,

        message:"API Route Not Found"

    });


}

);




// =====================================================
// DATABASE CONNECTION
// =====================================================


const connectDatabase = async()=>{


    try{


        await mongoose.connect(

            process.env.MONGO_URI

        );


        console.log(

            "✅ MongoDB Connected"

        );


    }


    catch(error){


        console.log(

            "❌ MongoDB Connection Failed",

            error.message

        );


        process.exit(1);


    }


};




// =====================================================
// SERVER START
// =====================================================


const startServer = async()=>{


    await connectDatabase();



    const PORT =

    process.env.PORT || 5000;



    app.listen(

        PORT,

        ()=>{


            console.log(

                `🚀 SmartTown Server running on port ${PORT}`

            );


        }

    );


};




// =====================================================
// SHUTDOWN
// =====================================================


process.on(

"SIGINT",

async()=>{


    await mongoose.connection.close();


    console.log(

        "MongoDB connection closed"

    );


    process.exit(0);


}

);




// START

startServer();