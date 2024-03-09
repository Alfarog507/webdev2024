//Express Setup
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const JOI = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campgrounds');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds');
// const reviews = require('./routes/reviews');

//JOI Validation

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

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

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/campgrounds/:id/reviews', validateReview, catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err });
});
