const multer = require('multer');


// used to store images in buffer in mongoose but we using base64 string in our project
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/profilePic')
    },
    filename:(req,file,cb)=>{

        cb(null,Date.now()+"-"+file.fieldname+".jpeg")
    }
})

const upload = multer({storage:storage})

module.exports = upload