import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


/* 2nd Approach 
write connection function in a separate db folder and import it into index.js and execute (clean, modular, professional)
*/
const connectDB = async () => {
    try {
        const connetionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected !! DB Host: ${connetionInstance.connection.host}`);
        // console.log(connetionInstance);
    } catch(error) {
        console.log("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

export default connectDB;


/* 1st Approach
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("error:", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch(error) {
        console.error("ERROR:", error);
        throw err;
    }
})()
*/