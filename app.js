//Express Setup
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressErrors');
// const JOI = require('joi');
// const { campgroundSchema, reviewSchema } = require('./schemas.js');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

//Mongoose Setup
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Mongo connection open!')
    })
    .catch(err => {
        console.log('Oh no, Mongo connection error!')
        console.log(err)
    })

//Server Setup
app.listen(3000, () => {
    console.log('Serving on port 3000');
});

//EJS Setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

//Routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err });
});
