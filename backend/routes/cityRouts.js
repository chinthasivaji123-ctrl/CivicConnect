const express = require("express");

const router = express.Router();

const cities = require("../data/cities.json");


router.get("/search", (req,res)=>{


    try{


        const query = req.query.q;


        if(!query){

            return res.json([]);

        }



        const result = cities.filter(city =>

            city.toLowerCase()
            .includes(query.toLowerCase())

        )
        .slice(0,20);



        res.json(result);


    }

    catch(error){


        console.log(error);

        res.status(500).json({

            message:"City search failed"

        });


    }


});



module.exports = router;