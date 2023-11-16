const mongoose = require('mongoose');
const Tours = require('../models/Tours');
const Types = require('../models/Types');
const Utils = require('../Utils');
const NewsController = {

    Add_tour : async (req,res) => {
        try {

            const filenames = req.files.map((file) => file.filename); // Lấy danh sách các tên file đã lưu
            console.log(filenames); // Hiển thị danh sách các tệp hình ảnh đã nhận được từ Angular

            const tours = await new Tours({
                title : req.body.title ,
                description : req.body.description , 
                image : filenames ,
                plan : req.body.plan ,
                map : req.body.map ,
                link : req.body.link || 'chi-tiet-tour/' + Utils.slug(req.body.title),
                slug :  Utils.slug(req.body.title),
                category_id : req.body.category_id ,
                updated_at : Date.now() ,
                created_at : Date.now() ,
                type_id : req.body.type_id,
                outstanding : req.body.outstanding 
            })
            const toursave = await tours.save() ;
            if(toursave) {
                console.log(toursave.type_id);
                // thêm bài viết này vào cái bụng bầu của thể loại 
                 // Thêm bài viết này vào cái bụng bầu của thể loại
                const datatypes = await Types.findByIdAndUpdate(
                    req.body.type_id,
                    { $push: { bump: toursave._id } }, // Sử dụng toursave._id thay vì req.body._id
                    { new: true } // Trả về tài liệu đã được cập nhật
                );
                console.log(datatypes);
                 res.status(200).json({status : 200 , message : toursave , message2 : datatypes});
            } else {
                res.status(404).json({status : 404 , message : 'lỗi rồi'});
            }
        } catch (error) {
            res.status(404).json({status : 404 , message : error});
        }
    },
    
    List_tour : async(req,res) => {
        try {
            const list = await Tours.find().populate('category_id').populate('type_id').sort({ updated_at: -1 }); ;
            res.status(200).json(list) ;
        } catch (error) {
            res.status(404).json(error);
        }
    },

    get_image_tour : async(req,res) => {
        try {
            const list = await Tours.find().select('link image').populate('category_id').populate('type_id').sort({ updated_at: -1 }); ;
            res.status(200).json(list) ;
        } catch (error) {
            res.status(404).json(error);
        }
    },

    NewFeed : async(req,res) => {
        try {
            const list = await Tours.find().sort({ updated_at: -1 }).populate('type_id').limit(3) ;
            res.status(200).json(list) ;
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Find_new_Category : async(req,res) => {
        try {
            const list = await Tours.find({category_id : req.body.id_category});
            res.status(200).json(list);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Find_tour_Category_get : async (req,res) => {
        try {
            const list = await Tours.find({category_id : req.params._id}).populate('type_id').sort({ updated_at: -1 });
            res.status(200).json(list);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Find_new_Category_get_limit: async(req,res) => {
        try {
            const list = await Tours.find({category_id : req.params._id}).limit(6);
            res.status(200).json(list);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    One_new : async(req,res) => {
        try {
            const one = await Tours.findOne({slug : req.params.slug}).populate('type_id');
            res.status(200).json(one);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Update_tour : async(req,res) => {
        try {
            if(req.body.image_remove) {
                Utils.removeimage_uploads(req.body.image_remove);
            }

            const database = await Tours.findByIdAndUpdate(req.body._id , {
                title : req.body.title ,
                description : req.body.description , 
                image : req.body.image ,
                type_id : req.body.type_id ,
                link :  'chi-tiet-tour/' + Utils.slug(req.body.title),
                slug : Utils.slug(req.body.title),
                plan : req.body.plan ,
                map : req.body.map ,
                category_id : req.body.category_id ,
                outstanding : req.body.outstanding ,
                updated_at : Date.now() ,
                created_at : Date.now() 
            })

            if(database){
                res.status(200).json({status : 200 , message : "update thanh cong"});
            } else {
                res.status(404).json({ status : 404 , message : "Khong ton tai "});
            }
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Update_new_image : async(req,res) => {
        try {
            const filenames = req.files.map((file) => file.filename); // Lấy danh sách các tên file đã lưu
            if(req.body.image_remove) {
                Utils.removeimage_uploads(req.body.image_remove);
            }

            
            const imageold = req.body.image_old ;
            var image_update = []  ;
            if(typeof imageold == 'string') {
                image_update = filenames ;
                image_update.push(imageold);
            } else {
                image_update = [... filenames , ... imageold] ;
            }
             
           // remove image in uploads 

            const database = await Tours.findByIdAndUpdate(req.body._id , {
                title : req.body.title ,
                description : req.body.description , 
                image : image_update ,
                type_id : req.body.type_id ,
                link :  'chi-tiet-tour/' + Utils.slug(req.body.title),
                slug : Utils.slug(req.body.title),
                plan : req.body.plan ,
                map : req.body.map ,
                category_id : req.body.category_id ,
                outstanding : req.body.outstanding ,
                updated_at : Date.now() ,
                created_at : Date.now() 
            })

            if(database){
                res.status(200).json({status : 200 , message : "update thanh cong"});
            } else {
                res.status(404).json({ status : 404 , message : "Khong ton tai "});
            }
        } catch (error) {
            res.status(404).json(error);
        }
    },

    get_tour : async(req,res) => {
        try {
            const one = await Tours.findOne({_id : req.params.id});
            res.status(200).json(one);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Del_tour : async(req , res) => {
        try {
            const imagecurren = await Tours.findById(req.body._id);
            Utils.removeimage_uploads(imagecurren.image);
            
            // const del = await News.deleteOne({_id : req.body._id});

            const deletedNews = await Tours.findByIdAndRemove(req.body._id);

            if (deletedNews) {
            // Xóa ID của bài viết khỏi mảng bump của thể loại
                await Types.updateMany(
                    {},
                    { $pull: { bump: deletedNews._id } },
                    { multi: true }
                );
                res.status(200).json({ status: 200, message: 'Xóa thành công' });
                } else {
                    res.status(404).json({ status: 404, message: 'Không tìm thấy bài viết' });
                }
            
        } catch (error) {
            res.status(404).json({message : "xóa thất bại "});
        }
    },

    Outstanding : async(req,res) => {
        try {
            const outstanding = await Tours.find({outstanding : true});
            res.status(200).json(outstanding);
        } catch (error) {
            res.status(494).json(error);
        }
    },

    Find_new_slug : async(req,res) => {
        try {
            const news = new News.find({})
        } catch (error) {
            
        }
    },

    Tim_kiem : async(req,res) => {
        try {
            const timkiem = req.body.timkiem;
            const data = await News.find({ $text: { $search: timkiem } });
            if(data.length > 0) {
                // có dữ liệu trả về 
                res.status(200).json({status : 200 , data});
            } else {
                res.status(200).json({status : 404 , data});
            }
        } catch (error) {
            res.status(404).json(error);
        }
    },

    So_luong : async(req,res) => {
        try {
            const count = await Tours.countDocuments();
            res.status(200).json(count);
        } catch (error) {
            res.status(404).json(error);
        }
    }

}

module.exports = NewsController ;