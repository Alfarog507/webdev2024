const express = require('express');
const router = express.Router();
const campgounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campgrounds');

router.get('/', catchAsync(campgounds.index));

router.get('/new', isLoggedIn, campgounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgounds.createCampground));

router.get('/:id', catchAsync(campgounds.showCampgrounds));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgounds.deleteCampground));

module.exports = router;