const express = require('express');
const bookingContoller =  require('../controllers/bookingControllers');
const authContoller = require('../controllers/authController');
const router = express.Router();

router.use(authContoller.protect);
router.get('/checkout-session/:mobileId',bookingContoller.getCheckOutSession);
router.use(authContoller.restrictTo('admin'));

router
  .route('/')
  .get(bookingContoller.getAllBookings)
  .post(bookingContoller.createBooking);

router
  .route('/:id')
  .get(bookingContoller.getBooking)
  .patch(bookingContoller.updateBooking)
  .delete(bookingContoller.deleteBooking);


module.exports = router;
