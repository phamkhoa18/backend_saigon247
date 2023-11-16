const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    title : String , 
    slug : String , 
    link : String ,
    bump : [{type : mongoose.Types.ObjectId , ref : 'News'}]
})


const Types = mongoose.model('Types' , typeSchema);
module.exports = Types ;
