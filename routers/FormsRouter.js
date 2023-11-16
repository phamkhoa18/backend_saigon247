const FormsController = require('../controllers/FormsController');
const Util = require('../Utils');
const router = require('express').Router();


// router (đường dẫn)

// THÊM 
router.post('/addform' ,FormsController.Add_Forms);

router.get('/listform' , FormsController.List_Forms);

router.get('/delform/:id' ,FormsController.Del_Forms);

router.post('/handleupdate' , FormsController.Handle_Update);

router.get('/soluongcanxuly' , FormsController.Xuly_contact);

// router.get('/sendemail' , Util.guiEmailChoBan);

router.post('/sendemail' , FormsController.Send_Mail);


module.exports = router ;