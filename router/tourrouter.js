const express = require('express')
const tourController = require('./../controllers/tourcontroller');
const authController = require('./../controllers/authController')
const router = express.Router();
router.route('/top-5-cheap').get(tourController.aliaTour,tourController.getAllTour);
router
.route('/')
.get(authController.protect,tourController.getAllTour)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(authController.protect,authController.restrictTo('admin'),tourController.deleteTour);
module.exports = router;