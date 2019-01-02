const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/keys').mongoURI;
const passport = require('passport');
const languagesRoutes = require('./API/routes/languages');

mongoose.connect('mongodb://mahmod:123456A@ds249623.mlab.com:49623/languages_index', { useNewUrlParser: true })
    .then(() => {
        console.log('mongoDB connected');
    }).catch((err) => {
        console.log(err);
    });


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//cors to allow access 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", " POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});



//routes
app.use('/languages', languagesRoutes);


app.get('/', (req, res, next) => {
    res.json({
        message: "check the api in the link bellow",
        link: "https://events-social-network-api.herokuapp.com/"
    });
});

//handling page not found error
app.use((req, res, next) => {
    const error = new Error('page not found');
    error.status = 404;
    next(error);

});

//handling rest of errors in case its not handeled in routes
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;