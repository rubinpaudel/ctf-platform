import multer from 'multer';
import { UPLOADS_PATH } from '../consts';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOADS_PATH)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
// var upload = multer({ storage: storage });

export const multerUpload = multer({storage: storage});