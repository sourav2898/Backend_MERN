const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const connectDatabase = require('./config/database');
const errorMiddleware = require('./middleware/error');

app.use(express.json())
app.use(cookieParser())

// Route imports
const product = require('./routes/productRoutes');
const user = require('./routes/userRoutes');
const order = require('./routes/orderRoutes');

//Connect Database
connectDatabase(); 

app.use("/api/v1",product);  
app.use("/api/v1",user);  
app.use("/api/v1",order);  

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;