const mongoose = require('mongoose');


async function connectToDb() {
   try {
     await mongoose.connect(process.env.MONGO_URL);
     console.log('DB connected successfully');
   } catch(err) {
     console.error('DB connection failed:', err);
     process.exit(1);
   }
}


module.exports = {connectToDb}