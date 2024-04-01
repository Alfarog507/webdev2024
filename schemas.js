const JOI = require("joi");
const { number } = require("joi");

module.exports.campgroundSchema = JOI.object({
  campground: JOI.object({
    title: JOI.string().required(),
    price: JOI.number().required().min(0),
    // image: JOI.string().required(),
    location: JOI.string().required(),
    description: JOI.string().required(),
  }).required(),
  deleteImages: JOI.array(),
});

module.exports.reviewSchema = JOI.object({
  review: JOI.object({
    rating: JOI.number().required().min(1).max(5),
    body: JOI.string().required(),
  }).required(),
});

// This is the schema that we will use to validate the data that we receive from the form.  We will use this schema in the app .post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => { ... }) route handler in app.js.
