// import mongoose to ease connection with db
import mongoose from 'mongoose';

// db connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/jwtAuthentication', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB