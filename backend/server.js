import express from "express";
import dotenv from "dotenv";
import  dbConnect  from "./utils/dbConnect.js";
import cors from "cors";

dotenv.config({quiet: true});

const app = express();

app.use(express.json());

app.use(cors());

dbConnect();



process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});