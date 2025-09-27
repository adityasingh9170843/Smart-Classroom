import mongoose from "mongoose";


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection error",error);
        process.exit(1);
    }
};

export default dbConnect;