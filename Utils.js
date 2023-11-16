const Categories = require("./models/Categories");
const multer = require('multer');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const nodemailer = require('nodemailer');
const PizZip = require('pizzip');
const { v4: uuidv4 } = require('uuid');
const Util = {
    getChildCategories : async (categoryId) => {
       const categories = await Categories.find({ parent_id: categoryId });
       if (categories.length === 0) {
         return [];
       }
       const childIds = categories.map(category => category._id);
       const nestedChildren = await Promise.all(childIds.map(Util.getChildCategories));
       console.log(nestedChildren);
       return categories.concat(...nestedChildren);
     },
     slug :(title) => {
       var slug ;
       //Đổi chữ hoa thành chữ thường
       slug = title.toLowerCase();

       //Đổi ký tự có dấu thành không dấu
       slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
       slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
       slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
       slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
       slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
       slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
       slug = slug.replace(/đ/gi, 'd');
       //Xóa các ký tự đặt biệt
       slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|'|\"|\:|\;|_/gi, '');
       //Đổi khoảng trắng thành ký tự gạch ngang
       slug = slug.replace(/ /gi, "-");
       //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
       //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
       slug = slug.replace(/\-\-\-\-\-/gi, '-');
       slug = slug.replace(/\-\-\-\-/gi, '-');
       slug = slug.replace(/\-\-\-/gi, '-');
       slug = slug.replace(/\-\-/gi, '-');
       //Xóa các ký tự gạch ngang ở đầu và cuối
       slug = '@' + slug + '@';
       slug = slug.replace(/\@\-|\-\@|\@/gi, '');
       return slug ;
     },

     removeimage_uploads : (image_curren) => {
      const uploadDir = path.join(__dirname, 'uploads');
      
      if (typeof image_curren === 'string') { // Kiểm tra xem image_curren là một chuỗi
        const filePath = path.join(uploadDir, image_curren);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (error) => {
            if (error) {
              console.error(`Không thể xóa tệp tin ${image_curren}: ${error}`);
            } else {
              console.log(`Đã xóa tệp tin ${image_curren} thành công.`);
            }
          });
        } else {
          console.error(`Không tìm thấy tệp tin ${image_curren}.`);
        }
      } else if (Array.isArray(image_curren)) { // Kiểm tra xem image_curren là một mảng
        image_curren.forEach((v) => {
          const filePath = path.join(uploadDir, v);
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (error) => {
              if (error) {
                console.error(`Không thể xóa tệp tin ${v}: ${error}`);
              } else {
                console.log(`Đã xóa tệp tin ${v} thành công.`);
              }
            });
          } else {
            console.error(`Không tìm thấy tệp tin ${v}.`);
          }
        });
      } else {
        console.error('Tham số không hợp lệ. Hãy đảm bảo rằng image_curren là một chuỗi hoặc một mảng.');
      }
    },

     // Hàm gửi email cho bạn
  guiEmailChoBan(mailOptions) {
  // Cấu hình transporter (SMTP)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Thay thế bằng SMTP server bạn sử dụng
    service : "Gmail" ,
    secure: true,
    auth: {
      user: 'thongtinkhachhangphaply@gmail.com', // Thay thế bằng email của bạn
      pass: 'qrsburtzvxoeykiw', // Thay thế bằng mật khẩu email của bạn
    },
  });
  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email gửi đi: ' + info.response);
    }
  });
} ,

  TransformJsonToDoc(contentform)  {
      console.log(contentform);
  } ,

  readDocxContent(filePath , data ) {
    // Read the .docx file as binary data
    const content = fs.readFileSync(filePath, 'binary');

    // Load the content into a Docxtemplater instance
    const doc = new Docxtemplater().loadZip(new PizZip(content));
     
    const datanew = {
      title : data.title.toUpperCase() 
    } ;

    data.content.forEach((e) => {
      for (const key in e) {

        if (Array.isArray(e[key]) && (e[key].length === 0 || e[key].every(item => item === null || item === ''))) {
          datanew[key] = ['Không có'];
        } else if (e[key] === '' || e[key] === null) {
          datanew[key] = 'Không có';
        } else {
          datanew[key] = e[key];
        }
        
      }
    });
    doc.setData(datanew);
    // Get the full content of the document as a string
    try {
      // Render the document with the data
      doc.render();
    } catch (error) {
      // Handle errors
      console.error('Error rendering the document:', error);
      return;
    }

    // Đường dẫn tới thư mục đích
    const outputDir = 'output_docx';

    // Đảm bảo thư mục đích tồn tại
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    const randomFileName = data.title + ' - ' + data.name + ' - ' + uuidv4() + '.docx';
    console.log(randomFileName);
    const filePath_out = path.join(outputDir, randomFileName);
  
    // Write the rendered content to a new file
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(filePath_out, buf);
    console.log('File created:', randomFileName);

    // Gửi thông tin đó vào gmail 

    const mailOptions = {
      from: 'thongtinkhachhangphaply@gmail.com', // Điền email Gmail của bạn
      to: 'phamkhoatailieu@gmail.com, hotro@trogiupphaply.com.au, hotro@phaplyvietnam.com', // Điền địa chỉ email của khách hàng
      subject: data.title + ' - ' + data.name + ' - ' + data.date,
      text: 'ĐÂY LÀ EMAIL TỰ ĐỘNG CỦA TRỢ GIÚP PHÁP LÝ VIỆT NAM ',
      html: '<p>Thông tin khách hàng ở file Docx </p>',
      attachments: [
        {
          filename: randomFileName,
          path: filePath_out,
        },
      ],
    };

    return mailOptions ;

  }
  
 

}

module.exports = Util ;