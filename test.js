const API_URL = process.env.API_URL === undefined ? 
                "http://localhost:5000": process.env.API_URL;

console.log(API_URL)