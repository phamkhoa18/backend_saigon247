const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title       : {type : String , required : true} ,
    description : {type : String , required : true} ,
    image : [] ,
    category_id : {type : mongoose.Types.ObjectId , ref : 'Categories'} ,
    map : {type : String },
    plan : [],
    link : {type : String } ,
    slug : {type : String } ,
    type_id : {type : mongoose.Types.ObjectId , ref : "Types"} ,
    outstanding : {type : Boolean , default : false} ,
    created_at  : {type : Date , default : Date.now()},
    updated_at  : {type : Date , default : Date.now()},
})


const Tours = mongoose.model('Tours' , tourSchema);
module.exports = Tours ;
