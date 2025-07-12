const cds = require('@sap/cds');
const express = require('express');
const cors = require('cors');


cds.on('bootstrap', (app) => {
    console.log("Inside bootstrap");


    const expressApp = express();
    const corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200
    };


    expressApp.use((req, res, next) => {
        console.log("Inside CORS middleware");
        next();
    });
    expressApp.use(cors(corsOptions));


    app.use((req, res, next) => {
        console.log("Inside main app middleware");
        next();
    });
    app.use(expressApp);
});

module.exports = cds.server;