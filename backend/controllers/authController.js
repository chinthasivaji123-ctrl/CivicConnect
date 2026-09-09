const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// =======================
// REGISTER USER
// =======================

const registerUser = async (req, res) => {

    try {

        const { name, mobile, email, password } = req.body;


        console.log("========== REGISTER REQUEST ==========");
        console.log(req.body);



        // Check existing user

        const existingUser = await User.findOne({

            email: email.toLowerCase()

        });


        if (existingUser) {

            return res.status(400).json({

                message: "User already exists"

            });

        }



        // Hash password

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );



        // Create user
        // IMPORTANT:
        // Every new account will be CITIZEN

        const user = await User.create({

            name,

            mobile,

            email: email.toLowerCase(),

            password: hashedPassword,

            role:"citizen"

        });



        console.log("NEW USER CREATED:", user);



        return res.status(201).json({

            message:"Registration successful",

            user:{

                id:user._id,

                name:user.name,

                mobile:user.mobile,

                email:user.email,

                role:user.role

            }

        });


    }

    catch(error){


        console.log("REGISTER ERROR:",error);


        return res.status(500).json({

            message:"Registration failed"

        });


    }

};





// =======================
// LOGIN USER
// =======================


const loginUser = async(req,res)=>{


    try{


        const {email,password}=req.body;


        console.log("\n========== LOGIN REQUEST ==========");
        console.log("EMAIL:",email);



        // Find user

        const user = await User.findOne({

            email:email.toLowerCase()

        });



        console.log("USER FOUND:",user);



        if(!user){


            return res.status(404).json({

                message:"User not found"

            });


        }




        // Check password

        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );



        console.log(

            "PASSWORD MATCH:",

            passwordMatch

        );



        if(!passwordMatch){


            return res.status(400).json({

                message:"Invalid password"

            });


        }





        console.log(

            "LOGIN ROLE:",

            user.role

        );




        // Generate JWT Token


        const token = jwt.sign(


            {

                id:user._id,

                role:user.role

            },


            process.env.JWT_SECRET,


            {

                expiresIn:"7d"

            }


        );




        console.log(

            "TOKEN GENERATED"

        );





        return res.status(200).json({


            message:"Login successful",


            token,



            user:{


                id:user._id,


                name:user.name,


                mobile:user.mobile,


                email:user.email,


                role:user.role


            }



        });



    }


    catch(error){


        console.log(

            "LOGIN ERROR:",

            error

        );


        return res.status(500).json({


            message:"Server error"


        });


    }



};






module.exports={

    registerUser,

    loginUser

};