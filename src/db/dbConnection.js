const mongoose = require("mongoose")

// Connect to the MongoDB database
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
