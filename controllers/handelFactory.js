const catchAsync  = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const ApiFeatures = require('./../util/apifeatures');
exports.getAll = Model=>catchAsync(async(req,res,next)=>{
    let fillter = {};
    if(req.params.mobileId) fillter = {mobile:req.params.mobileId} 
    //Exection
    const features = new ApiFeatures (Model.find(fillter),req.query)
    .filter()
    .sort()
    .limitField()
    .paginate();
    const doc = await features.query;

    res.status(200).json({
        status:"success",
        result:doc.length,
        data:{
            data:doc
        }
    })
})

exports.getOne = (Model,popOption)=>catchAsync(async(req,res,next)=>{
    let query =   Model.findById(req.params.id);
    if(popOption){
        query = query.populate(popOption)
    }
    const doc = await query
    if(!doc){
        return next(new AppError('No document found with that Id',404))
    }
    res.status(202).json({
        status:'success',
        data:{
            data:doc
        }
    })
})

exports.createOne = Model=>catchAsync(async(req,res,next)=>{
    const doc = await Model.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
         data:doc
        }
    })
});
exports.updateOne = Model=>catchAsync(async(req,res,next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true,
        new:true
    });
    if(!doc){
        return next(new AppError('No document found with that Id',404))
    }
    res.status(203).json({
        status:'success',
        data:{
            data:doc
        }
    })
});
exports.deleteOne =  Model=>catchAsync(async(req,res,next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError('No document found with that Id',404))
    }
    res.status(204).json({
        status:'success',
        data:null
    })
});