const mongoose = require('mongoose');

const donorSchema = mongoose.Schema({
    Name:{
        type:String,
        required: true
    },
    Phone:{
        type:Number,
        required: true
    },
    State:{
        type:String,
        required: true
    },
    Period:{
        type:String,
        required: true
    },
    Group:{
        type:String,
        required: true
    },
    Age:{
        type:Number,
        required: true
    }
})
module.exports=mongoose.model('Donor',donorSchema);