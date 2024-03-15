const express = require('express');
const router = express.Router();
const campgounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campgrounds');

router.route('/')
    .get(catchAsync(campgounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgounds.createCampground));

router.get('/new', isLoggedIn, campgounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgounds.renderEditForm));

module.exports = router;