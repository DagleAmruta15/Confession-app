import express from "express";
import cors from "cors";
import connectDB from "../db/connectdb.js";
import { router } from "../routes/route.js";

const app = express();
const PORT = 8000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use("/", router);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error", err);
    });
