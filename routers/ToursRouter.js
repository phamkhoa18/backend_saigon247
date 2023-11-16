const ToursController = require('../controllers/ToursController');
const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  }
});




const upload = multer({ storage: storage });
// router (đường dẫn)
router.post('/addtour' , upload.array('images') , ToursController.Add_tour);

router.post('/updatetour_image' , upload.array('image_new') , ToursController.Update_new_image);

router.post('/updatetour' , ToursController.Update_tour);


router.get('/listtour' , ToursController.List_tour);

router.get('/listimagetour' , ToursController.get_image_tour);

router.get('/listtours_id/:id' , ToursController.get_tour);

router.get('/newfeed' , ToursController.NewFeed);

router.post('/findnewcategory' , ToursController.Find_new_Category);

router.get('/findtourcategory/:_id' , ToursController.Find_tour_Category_get);

router.get('/findnewcategorylimit/:_id' , ToursController.Find_new_Category_get_limit);

router.get('/listtour/:slug' , ToursController.One_new);

router.post('/deltour' , ToursController.Del_tour);

router.get('/outstanding' , ToursController.Outstanding);

router.get('/findnew/:slug' , ToursController.Find_new_slug);

router.post('/tim-kiem' , ToursController.Tim_kiem );

router.get('/soluongbaiviet' , ToursController.So_luong);

module.exports = router ;