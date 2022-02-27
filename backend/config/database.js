const mongoose = require('mongoose');

const dotenv = require('dotenv');
// Config
dotenv.config({path:"backend/config/config.env"});

const DB_URI = process.env.DB_URI;

const connectDB = () => {
    mongoose.connect(DB_URI,{useNewUrlParser: true, useUnifiedTopology: true })
    .then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`)
    })
}

module.exports = connectDB;