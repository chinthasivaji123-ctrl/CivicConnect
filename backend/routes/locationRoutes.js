const express = require("express");

const router = express.Router();

const axios = require("axios");




// ==================================
// GET ALL STATES OF INDIA
// ==================================

router.get("/states", async(req,res)=>{


    try{


        const response = await axios.post(


            "https://countriesnow.space/api/v0.1/countries/states",


            {
                country:"India"
            }


        );




        const states = response.data.data.states.map(

            item => item.name

        );



        res.status(200).json(states);



    }


    catch(error){


        console.log(

            "STATE ERROR:",
            error.message

        );



        res.status(500).json({

            message:"Unable to fetch states"

        });


    }


});









// ==================================
// GET DISTRICTS BY STATE
// ==================================
// Using India Post database


router.get("/districts/:state", async(req,res)=>{


    try{


        const state=req.params.state;



        const response = await axios.get(


            `https://api.postalpincode.in/postoffice/${state}`


        );




        const data=response.data[0];




        if(data.Status !== "Success"){


            return res.json([]);


        }





        const districts=[

        ];





        data.PostOffice.forEach(place=>{


            if(!districts.includes(place.District)){


                districts.push(place.District);


            }


        });





        res.status(200).json(districts);



    }


    catch(error){


        console.log(

            "DISTRICT ERROR:",
            error.message

        );



        res.status(500).json({

            message:"District fetch failed"

        });


    }


});











// ==================================
// SEARCH CITY / TOWN / VILLAGE
// ==================================


router.get("/search/:name", async(req,res)=>{


    try{


        const name=req.params.name;



        const response = await axios.get(


            `https://api.postalpincode.in/postoffice/${name}`


        );




        const data=response.data[0];




        if(data.Status !== "Success"){


            return res.json([]);


        }





        const places=data.PostOffice.map(place=>({



            name:place.Name,


            district:place.District,


            state:place.State,


            pincode:place.Pincode



        }));





        res.status(200).json(places);



    }


    catch(error){


        console.log(

            "CITY SEARCH ERROR:",
            error.message

        );



        res.status(500).json({

            message:"City search failed"

        });


    }


});












// ==================================
// GET COMPLETE ADDRESS USING PINCODE
// ==================================


router.get("/pincode/:pincode", async(req,res)=>{


    try{


        const pincode=req.params.pincode;




        const response = await axios.get(


            `https://api.postalpincode.in/pincode/${pincode}`


        );





        const data=response.data[0];





        if(data.Status !== "Success"){


            return res.status(404).json({


                message:"Invalid Pincode"


            });


        }







        const post=data.PostOffice[0];







        res.status(200).json({



            state:post.State,


            district:post.District,


            city:post.Name,


            division:post.Division,


            pincode:post.Pincode



        });





    }


    catch(error){



        console.log(

            "PINCODE ERROR:",
            error.message

        );



        res.status(500).json({


            message:"Pincode search failed"


        });



    }


});







module.exports = router;