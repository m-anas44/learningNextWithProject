import mongoose from "mongoose";

type connnectionObject = {
  isConnected?: number;
};

const connection: connnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("Db connented successfully");
  } catch (error) {
    console.log("DB connection failed: ", error);
    process.exit(1);
  }
}

export default dbConnect;
