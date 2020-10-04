const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('../controllers/bookingControllers')
const router = express.Router();


router.get('/',authController.isLoggedIn,viewController.getOverview)
router.get('/mobile/:slug',authController.isLoggedIn,viewController.getMobile)
router.get('/login',authController.isLoggedIn,viewController.getLoginForm)
router.get('/account',authController.isLoggedIn,viewController.getAccount)
router.get('/singup',viewController.getSingupForm);


router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.protect,
  viewController.getOverview
);



router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
  );
  
  
module.exports = router;