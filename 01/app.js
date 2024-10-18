import express, { json, urlencoded } from "express";
import { connectToDb } from "./configs/Db.js";
import cors from "cors";
import { router as userRouth } from "./route/userRoutes.js";
import cookieParser from "cookie-parser";

const app = express(); // Taking instance of express in app; 

connectToDb(); // Initialiging connection to Db.

app.use(json());
app.use(urlencoded({extended: true}));
app.use(cookieParser()); // Middleware to parse cookies from the client request.
app.use(cors({ 
    origin: [process.env.CLIENT_URL], 
    credentials: true 
})) // MiddleWare to enable "Cross-Origin Resource Sharing (CORS)". 

// (i). HOME_routh handalling :---
app.get("/" , (req , res)=>{
    res.status(200).json({
        success: true ,
        msg: "You are on the Home Page!"
    })
})

// (ii). "/api/auth" rout handalling :---
app.use("/api/auth" , userRouth);

// (iii). handalling wrong routh :---
app.use("*" , (eq , res)=>{
    res.status(404).json({
        success: false,
        message: "404! Page not Found : Wrong Request"
    })
})


export { app }










/*

Importent Note:---

// MiddleWare to enable "Cross-Origin Resource Sharing (CORS)".
app.use(cors({ 
    "origin: [process.env.CLIENT_URL]" ,
    credentials: true .
})) 

(1). "origin: [process.env.CLIENT_URL]" : The origin option specifies the client domains permitted to make requests to the server, using the CLIENT_URL environment variable to allow requests solely from that URL.

(2). "credentials: true " : This option allows the server to accept and send cookies (or other credentials like HTTP authentication) in cross-origin requests.


*/