const mongoose = require('mongoose');

const toueSchema = new mongoose.Schema({
    name:{
        type:String
    }
})

const Tour = mongoose.model('Tour',toueSchema);
module.exports = Tour;
