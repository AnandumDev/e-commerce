import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file , cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file , cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {fieldSize: 2 * 1024 * 1024},
    fileFilter: (req, file , cb) => {
        const fileType = /jpeg|jpg|png/

        const extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase())

        if(extname){
            cb(null, true)
        }else{
            cb(new Error("Only .jpeg .jpg .png images allowed"))
        }
    }
})

export default upload