require("dotenv").config();
const jwt = require("jsonwebtoken");


const token = jwt.sign(
    {
        id:"123",
        role:"citizen"
    },
    process.env.JWT_SECRET,
    {
        expiresIn:"7d"
    }
);


console.log(token);



const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);


console.log(decoded);