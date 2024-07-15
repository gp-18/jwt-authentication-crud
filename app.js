// dot env 
import dotenv from "dotenv";
// express
import express from "express";
// cors
import cors from "cors";
// database
import connectDB from "./config/connectdb.js";
// import Routes 
import router from "./routes/userRoutes.js";

// to use .env variables
dotenv.config();

// setting up express 
const app = express();

// port number to hos the server
const port = process.env.PORT;

// to connect server to database
connectDB()

// to use data coming from req.body
app.use(express.json());

// cors 
app.use(cors());

// Load Routes 
app.use("/api/user" , router)

// server listening on port
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
