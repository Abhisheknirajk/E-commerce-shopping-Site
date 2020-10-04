const Mobile = require('./../model/mobileModel');
const catchAsync =  require('./../util/catchAsync');
const User = require('./../model/usermodel');
const Booking = require('../model/bookingModel');
exports.getOverview = catchAsync(async(req,res,next)=>{
    const mobiles =  await Mobile.find();
    let i = 0;
    let limitMobile = []; 
    for(i;i<=5;i++){
      limitMobile[i] = mobiles[i];
    }
      // console.log(mobiles)
    res.status(200).render('overview',{
        title:'Online Shoping Site for Mobiles...',
        mobiles,
        limitMobile
    })
})

exports.getMobile = catchAsync(async(req,res,next)=>{
  const mobile = await Mobile.findOne({slug:req.params.slug}).populate({
    path:'reviews',
    fields:'review rating user'
  })
  // console.log(mobile)
  res.status(200).render('mobile',{
    title:`${mobile.name}`,
    mobile
  })
})




exports.getLoginForm = (req,res)=>{
  console.log('login',req.body)
  res.status(200).render('login',{
    title:'Login Into Your Account'
  })
}
exports.getSingupForm = (req,res)=>{
  console.log('singup',req.body)
  res.status(200).render('singup',{
    title:'Create your Account'
  })
}

exports.getAccount = (req,res)=>{
  console.log('update Data',req.body)
  res.status(200).render('anotherform',{
    title:'Another Form'
  })
}



exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log('update Data',req.body)
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('anotherform', {
    title: 'Your account',
    user: updatedUser
  });
});


exports.createAccount = catchAsync(async (req, res, next) => {
  console.log('update Data',req.body)
  const updatedUser = await User.create(
  
    {
     
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('anotherform', {
    title: 'Your account',
    user: updatedUser
  });
});




exports.getMyMobiles = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.mobile);
  const tours = await Mobile.find({ _id: { $in: mobileIDs } });

  res.status(200).render('overview', {
    title: 'My Mobiles',
    mobiles
  });
});