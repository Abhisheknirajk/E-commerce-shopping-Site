const mongoose = require('mongoose');
const slugify = require('slugify');
const mobileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A mobile shoud have a name'],
        unique:true
    },
    slug:String,
    brand:{
        type:String,
        required:[true,"A mobile should have a Brand name"]
    },
    price:{
        type:Number,
        require:[true,' A mobile should have a Price']
    },
    camera:{
        type:String,
        reuired:[true,'A mobile should have a camera detail']
    },
    display:{
        type:String,
        required:[true,'A mobile should should have Display detail']
    },
    memory:{
        type:String,
        reuired:[true,'A mobile should have a Memory detail']
    },
    operatingSystem:{
        type:String,
        required:[true, 'must have a OperatingSystem']
    },
    battery:{
        type:String,
        required:['must have a battery detail']
    },
    ratingsAverage:{
        type:Number,
        default:4.5
    },
    ratingsQuantity: {
    type:Number,
    default: 0
    },
    includes:{
        type:String,
        required:[true,'Tell about what includes in this product']
    },
    images:[String],
    imageCover:{
        type:String,
        required:[true,"must have a imageCover"]
      },
      description: {
        type:String,
        required:[true,"A tour must have  a description"]
     },
     description1Name:{
      type:String
     },
     description2Name:{
         type:String
     },
     description3Name:{
     type:String
     },
     description1:{
         type:String
     },
     description2:{
         type:String
     },
     description3:{
         type:String
     }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
);
mobileSchema.index({ slug: 1 });
// Virtual populate
mobileSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'mobile',
    localField: '_id'
  });
    
 // DOCUMENT MIDDLEWARE: runs before .save() and .create()
mobileSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  

const Mobile = mongoose.model('Mobile',mobileSchema);
module.exports = Mobile;
