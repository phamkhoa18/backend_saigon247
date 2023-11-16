const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
const MenusRouter = require('./routers/MenusRouter');
const CategoriesRouter = require('./routers/CategoriesRouter');
const NewsRouter = require('./routers/NewsRouter');
const TypesRouter = require('./routers/TypesRouter');
const SlidersRouter = require('./routers/SlidersRouter');
const SettingsRouter = require('./routers/SettingsRouter');
const PartnersRouter = require('./routers/PartnersRouter');
const UsersRouter = require('./routers/UsersRouter');
const FormsRouter = require('./routers/FormsRouter');
const ToursRouter = require('./routers/ToursRouter');
const ButtonsRouter = require('./routers/ButtonsRouter');
const app = express() ;
const PORT = 5000 || process.env.PORT ;

dotenv.config();
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ limit : '50mb',extended: false }))
app.use(bodyParser.json({limit : '50mb'}));
app.use(morgan('common'));

const multer = require('multer');
const path = require('path'); // Thêm dòng này
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// CONNECT DATABASE 
mongoose.connect('mongodb://localhost:27017/SAIGON247').then(() => {
    console.log('Connect thành công');
}) 
.catch((err) => {
        console.log('Connect thất bại');
});


// router
app.use('/' , MenusRouter);
app.use('/' , CategoriesRouter);
app.use('/' , NewsRouter);
app.use('/' , TypesRouter);
app.use('/' , SlidersRouter);
app.use('/' , SettingsRouter);
app.use('/' , PartnersRouter);
app.use('/' , FormsRouter);
app.use('/' , UsersRouter);
app.use('/' , ToursRouter);
app.use('/' , ButtonsRouter) ;

app.listen(PORT , () => {
    console.log('Server run Port : 5000');
})