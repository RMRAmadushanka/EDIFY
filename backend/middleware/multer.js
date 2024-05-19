import  multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
/**
 * Middleware which uses memory storage to store uploaded files
 * @param {*} name - Name provided in the multi-part/data form
 */
export const fileUpload = (name) => upload.array(name);
