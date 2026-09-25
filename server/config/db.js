import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[SkillSwapLive] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[SkillSwapLive] MongoDB Connection Error: ${error.message}`);
    console.warn(`[SkillSwapLive] Notice: Please ensure your MongoDB Atlas URI or local MongoDB daemon is running.`);
  }
};

export default connectDB;
