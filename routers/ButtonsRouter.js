const ButtonsController = require('../controllers/ButtonsController');
const router = require('express').Router();


// router (đường dẫn)

// THÊM 
router.post('/addbutton' , ButtonsController.Add_button);

// LIST button
router.get('/listbutton' , ButtonsController.List_button);

// EDIT button 
router.post('/editbutton' , ButtonsController.Edit_button);

// FIND button _ID 
router.get('/findbuttonid/:id' , ButtonsController.Find_button_id) ;

// DEL button 
router.get('/delbutton/:id' , ButtonsController.Del_button);


module.exports = router ;