const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {


    try {


        // Get authorization header

        const authHeader = req.headers.authorization;



        if (!authHeader) {


            return res.status(401).json({

                message: "No token provided"

            });


        }




        // Check Bearer format

        const parts = authHeader.split(" ");



        if(parts.length !== 2 || parts[0] !== "Bearer"){


            return res.status(401).json({

                message:"Invalid token format"

            });


        }





        const token = parts[1];



        if(!token){


            return res.status(401).json({

                message:"Token missing"

            });


        }







        // Verify token

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );





        console.log(
            "DECODED USER:",
            decoded
        );





        // Store user information

        req.user = decoded;



        next();



    }

    catch(error){


        console.log(
            "JWT ERROR:",
            error.message
        );



        return res.status(401).json({

            message:"Invalid token"

        });



    }


};





module.exports = authMiddleware;