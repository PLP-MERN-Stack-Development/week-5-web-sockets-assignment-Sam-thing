const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function runCleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await User.deleteOne({ email: "sam@gmail.com" });
    console.log("🧹 Deleted:", result);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Cleanup failed:", err.message);
  }
}

runCleanup();
