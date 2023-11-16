const mongoose = require('mongoose');

const BtnSchema = new mongoose.Schema({
    title : {type : String} ,
    link  : {type : String} ,
    icon : {type : String } 
})

const Btns = mongoose.model('Btns' , BtnSchema);
module.exports = Btns ;
