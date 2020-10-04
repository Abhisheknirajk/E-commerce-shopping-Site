const mongoose  = require('mongoose');
const fs = require('fs')
const Mobile = require('./../../model/mobileModel');
const dotenv = require('dotenv');
dotenv.config({path:'./../../config.env'});
const Db = process.env.DATABASE;
mongoose.connect(Db,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(()=>{
    console.log('mongoose connected successfull');
})
const mobile = JSON.parse(fs.readFileSync(`${__dirname}/mobile.json`));
const importData = async()=>{
   try{
      await Mobile.create(mobile);
      console.log('Data created successfully');
   }catch(err){
  console.log(err)
   }
   process.exit(1);
};
const deleteData = async()=>{
    try{
    await Mobile.deleteMany();
    console.log('Data deleted successfully');
    }catch(err){
        console.log(err)
    }
    process.exit(1);
}

if(process.argv[2] === '--import'){
    importData();
}
if(process.argv[2] === '--delete'){
    deleteData()
}
