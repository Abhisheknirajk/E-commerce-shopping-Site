const path = require('path');
const express = require('express');
const mobileRouter = require('./router/mobileRouter')
const userRouter = require('./router/userrouter');
const morgan  = require('morgan');
const AppError = require('./util/appError');
const globalError =  require('./controllers/errorContoller');
const rateLimit = require('express-rate-limit');
const helemet = require('helmet');
const mongooseSanitization = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const reviewRouter = require('./router/reviewRouter');
const viewRouter = require('./router/viewRouter');
const bookingRouter  = require('./router/bookingRouter');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*")
  next()
})

//global
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))
//Security for all http request
app.use(helemet());

//Dvelopment Mode on
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Fisted a request limit from same Api
const rateLimiter = rateLimit({
  max:100,
  windowMs:60 * 60 *1000,
  message:'Too many request from this IP! Please try again in one hour'
});
app.use('/api',rateLimiter)

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//text middleware
app.use((req,res,next)=>{
  console.log(req.cookies);
  next();
})


// Data sanitization against NoSQL query injection
app.use(mongooseSanitization());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);


// Request for data Access

app.use('/api/v1/mobiles',mobileRouter)
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);
app.use('/',viewRouter);
app.all('*',(req,res,next)=>{
  next(new AppError(`cant not find ${req.originalUrl} on this server`));
});


app.use(globalError);
module.exports = app;
