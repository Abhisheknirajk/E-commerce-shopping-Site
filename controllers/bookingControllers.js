const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Mobile = require('../model/mobileModel');
const catchAsync = require('../util/catchAsync');
const Booking = require('../model/bookingModel');
const factory = require('./handelFactory');

exports.getCheckOutSession = catchAsync(async(req,res,next)=>{
 //1)GEt the currently booked Mobile
 const mobile = await Mobile.findById(req.params.mobileId);
 console.log(mobile);
 //2 Create Checkout Session
const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    success_url:`${req.protocol}://${req.get('host')}/?mobile=${
        req.params.mobileId
    }&user=${req.user.id}&price=${mobile.price}`,
    cancel_url:`${req.protocol}://${req.get('host')}/mobile/${mobile.slug}`,
    customer_email:req.user.email,
    client_reference_id: req.params.mobileId,
    line_items:[
        {
            name:`${mobile.name} Mobile`,
            description:mobile.description,
            images:[`http://localhost:9000/img/mobiles/${mobile.imageCover}`],
            amount:mobile.price*100,
            currency:'inr',
            quantity: 1
        }
    ]
});
//3 Create Session Response 
 res.status(200).json({
     status:'success',
     session
 })

});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {

    const { mobile, user, price } = req.query;
  
    if (!mobile && !user && !price) return next();
    await Booking.create({ mobile, user, price });
  
    res.redirect(req.originalUrl.split('?')[0]);
  });


  exports.createBooking = factory.createOne(Booking);
  exports.getBooking = factory.getOne(Booking);
  exports.getAllBookings = factory.getAll(Booking);
  exports.updateBooking = factory.updateOne(Booking);
  exports.deleteBooking = factory.deleteOne(Booking);
  