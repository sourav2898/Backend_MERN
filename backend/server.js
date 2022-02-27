const app = require('./app');

const dotenv = require('dotenv');

// Hnadling Uncaught Exception
process.on("uncaughtException", err => {
    console.log(`Error : ${err}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
})

// Config
dotenv.config({path:"backend/config/config.env"});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is working on http://localhost:${PORT}`);
})

// Handling Unhandled Promise Rejections
process.on("unhandledRejection", err=> {
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to unhandled promise rejection");

    server.close(() => {
        process.exit(1)
    })
})