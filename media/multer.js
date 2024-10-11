const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./gallery")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Filetype not supported. Only images files are allowed."), false)
    }
}

const image_file_size = 1024 * 1024 * 10 

const maxcount = 1

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: image_file_size, 
        files: maxcount 
    }
})

module.exports = upload