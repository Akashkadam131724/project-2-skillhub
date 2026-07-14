import mongosse from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/netcom-clone"

console.log(MONGO_URI);
const connectDB = async () => {
  try {
    await mongosse.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;