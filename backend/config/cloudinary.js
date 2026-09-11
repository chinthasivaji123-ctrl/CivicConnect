require("dotenv").config();

const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("=================================");
console.log("CLOUDINARY CONFIG CHECK");
console.log("Cloud name:", cloudName);
console.log("API key exists:", !!apiKey);
console.log("API secret exists:", !!apiSecret);
console.log("=================================");

if (!cloudName) {
    console.error("❌ CLOUDINARY_CLOUD_NAME is missing");
}

if (!apiKey) {
    console.error("❌ CLOUDINARY_API_KEY is missing");
}

if (!apiSecret) {
    console.error("❌ CLOUDINARY_API_SECRET is missing");
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

module.exports = cloudinary;