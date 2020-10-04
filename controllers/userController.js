const multer = require('multer');
const sharp = require('sharp');
const User = require('./../model/usermodel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const factory = require('./handelFactory');

//MULTER TO IMAGE STORAGE
// const multerStorage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//      cb(null,'public/img/users');
//     },
//     filename:(req,file,cb)=>{
//         const ext = file.mimetype.split('/')[1];
//         cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

// TO CHECK IT IS IMAGE OR NOTE

const multerfilefilter  =(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new AppError('Note an image! plaese upload only images',400),false)
    }
};
const upload = multer({
 storage:multerStorage,
 fileFilter:multerfilefilter
});
exports.uploadUserimage = upload.single('photo');

// exports.resizeImage = (req,res,next)=>{
//     if(req.file){
//         return next();
//     }
//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//     sharp(req.file.buffer).resize(500,500)
//     .toFormat('jpeg')
//     .jpeg({quality:90})
//     .toFile(`public/img/users/${req.file.filename }`);
//     next();
// }


exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
  
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
  
    next();
  });



const fillterObj = (obj, ...allowedfield)=>{
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedfield.includes(el))newObj[el] = obj[el]
    })
    return newObj;
}
exports.updateMe = catchAsync(async(req,res,next)=>{
    console.log(req.file);
    console.log(req.body);
    //1) Create error POST  on the password update 
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is note avilable for password upddate / please use the updat emy password',404));
    }
    //2) Fillter on un wanted fields 
     const filleterBody = fillterObj(req.body,'email','name');
     if(req.file) filleterBody.photo = req.file.filename;
     // 3) Update the user Document 
     const updateUser = await User.findByIdAndUpdate(req.user.id,filleterBody,{
         new : true,
         runValidators:true
     });
     res.status(200).json({
         status:'success',
         data:{
             user:updateUser
         }
     })
});

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
        status:"success",
        data:null
    })
});
exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead'
    });
  };

exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id
    next();
}

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);