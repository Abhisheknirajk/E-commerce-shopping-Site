const express = require('express');
const mobileController = require('./../controllers/mobilesController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../router/reviewRouter');
const router = express.Router();
router.use('/:mobileId/reviews',reviewRouter);
router.route('/')
.get(mobileController.getAllMobiles)
.post(authController.protect,authController.restrictTo('admin'),mobileController.createMobile)
//nested route


router.route('/:id')
.get(mobileController.getMobile)
.patch(authController.protect,authController.restrictTo('admin'),mobileController.updateMobile)
.delete(authController.protect,authController.restrictTo('admin'),mobileController.deleteMobile)

module.exports = router;