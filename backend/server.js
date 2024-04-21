import path from "path";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import decrAESRoutes from "./routes/decrAES.routes.js"
import decrMsgRoutes from "./routes/decrMsg.routes.js"
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
const PORT = process.env.PORT || 5000

const __dirname = path.resolve();

dotenv.config();
app.use(express.json());//to parse the incoming request from json payloads(from req.body)
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);//access the user route
app.use("/api/decraes",decrAESRoutes);//access to the decrypted aes key of the user
app.use("/api/decrmsg",decrMsgRoutes);// move to decrypt the messages
app.use(express.static(path.join(__dirname,"/frontend/dist")))//express.static to serve as a static files
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
//to run aour index.html file from sever as well

// app.get("/",(req,res) => {
//   res.send("Hello World!Tarachand Rana");
// });
server.listen(PORT,() => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);//ctrl x the readd after curly brace
});