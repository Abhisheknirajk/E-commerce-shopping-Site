// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Mobile = require('./mobileModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    mobile: {
      type: mongoose.Schema.ObjectId,
      ref: 'Mobile',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ mobile: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next){
  // this.populate({
  //   path:'mobile',
  //   select:'name'
  // }).populate({
  //   path:'user',
  //   select:'name photo'
  // });
  this.populate({
    path:'user',
    select:'name photo'
  });
  next();
})

reviewSchema.statics.calculateAverage = async function(mobileId){
  const stats = await this.aggregate([
    {
      $match:{mobile:mobileId}
    },
    {
      $group:{
        _id:'mobile',
        nRating:{$sum:1},
        avgRating:{$avg: '$rating'}
      }
    }
  ]);
  console.log(stats);
  if(stats.length>0){
    await Mobile.findByIdAndUpdate(mobileId,{
      ratingsQuantity:stats[0].nRating,
      atingsAverage:stats[0].avgRating
    })
  }else{
    await Mobile.findByIdAndUpdate(mobileId,{
      ratingsQuantity:0,
      atingsAverage:4.5
    })
  }
  
}

reviewSchema.post('save',function(){
  this.constructor.calculateAverage(this.mobile)
})

reviewSchema.pre(/^findOneAnd/,async function(next){
  this.r = await this.findOne();
  next();
})
reviewSchema.post(/^findOneAnd/,async function(){
  await this.r.constructor.calculateAverage(this.r.mobile);
  
})
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
