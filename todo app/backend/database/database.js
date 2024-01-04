import mongoose from "mongoose";

export const connectDB = async (DATABASE_URL) => {
  try {
    await mongoose.connect(
     "mongodb+srv://dushyantswaroop1808:00JgoHKb1Evpks03@crudtodoapp.lmtvdzr.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connect Successfully");
  } catch (error) {
    console.log(error);
  }
};


