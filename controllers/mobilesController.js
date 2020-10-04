const Mobile = require('./../model/mobileModel');
const factory = require('./handelFactory');
exports.getAllMobiles = factory.getAll(Mobile);
exports.getMobile = factory.getOne(Mobile,{path:'reviews'})
exports.createMobile = factory.createOne(Mobile);
exports.updateMobile = factory.updateOne(Mobile);
exports.deleteMobile = factory.deleteOne(Mobile);