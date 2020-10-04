const Review = require('./../model/reviewModel')
const factory = require('./handelFactory');

exports.mobileAndUser = (req,res,next)=>{
    if (!req.body.mobile) req.body.mobile = req.params.mobileId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}
exports.getAllReviews= factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);