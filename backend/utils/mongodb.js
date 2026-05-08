const mongoose = require('mongoose');


async function connectToDb() {
   try {
     await mongoose.connect(process.env.MONGO_URL);
     console.log('DB connected successfully');
     // Drop unique index on mobile for vendors to allow duplicates
     try {
       await mongoose.connection.collection('vendors').dropIndex('mobile_1');
       console.log('Mobile unique index dropped for vendors');
     } catch (e) {
       // Index might not exist or already be dropped
     }
   } catch(err) {
     console.error('DB connection failed:', err);
     process.exit(1);
   }
}


module.exports = {connectToDb}