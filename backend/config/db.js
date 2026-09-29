const mongoose = require('mongoose');

let isConnected = false;
let isMockStore = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<db_password>')) {
    console.warn('\n⚠️  [MongoDB Warning]: MONGODB_URI contains `<db_password>` placeholder or is unset.');
    console.warn('💡 [JanDrishti AI]: Running with robust Active Hybrid Store (Memory + JSON persistence) so everything runs seamlessly.');
    console.warn('👉 Update `backend/.env` with your real MongoDB Atlas password anytime to switch to Atlas Cloud.\n');
    isMockStore = true;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB Atlas Connected]: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`⚠️ [MongoDB Connection Warning]: ${error.message}`);
    console.log('🔄 Falling back to Active Hybrid Store for uninterrupted hackathon workflow.');
    isMockStore = true;
    return false;
  }
};

module.exports = {
  connectDB,
  isAtlasConnected: () => isConnected,
  isUsingMockStore: () => isMockStore,
};
