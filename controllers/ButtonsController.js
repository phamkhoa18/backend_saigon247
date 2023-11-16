const mongoose = require('mongoose');
const Button = require('../models/Button');
const Util = require('../Utils');
const ButtonsController = {
    Add_button : async (req,res) => {
        try {
            const menu = new Button({
                title : req.body.title , 
                link : req.body.link ,
                icon : req.body.icon 
            })
            const menusave = await menu.save();
            res.status(200).json({status : 200 , message : menusave});
        } catch (error) {
            res.status(404).json({status : 404 ,message : error});
        }
    },
    List_button : async (req,res) => {
        try {
            const menu = await Button.find() 
            res.status(200).json(menu);
        } catch (error) {
            res.status(404).json({message : error});
        }
    },
      Edit_button : async(req,res) => {

        const menudatabase = await Button.findByIdAndUpdate(req.body._id , {
                title : req.body.title , 
                link : req.body.link ,
                icon : req.body.icon 
        })
        if(!menudatabase) {
            res.status(404).json({status : 404 , message : "Sai id rồi"});
        }else{
            res.status(200).json({status : 200 , message : menudatabase});
        }
    }, 
    Del_button : async(req,res) => {
        const del = await Button.deleteOne({_id : req.params.id});
        if (del.deletedCount === 1) {
            res.status(200).json({ status : 200 , message : 'Successfully deleted one document.'});
        } else {
            res.status(404).json({status : 404 ,message : 'No documents matched the query. Deleted 0 documents.'});
        }
    },

    Find_button_id : async (req,res) => {
        const menudatabase = await Button.findOne({_id : req.params.id});
        res.status(200).json(menudatabase);
    }
}
module.exports = ButtonsController ;