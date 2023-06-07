const multer = require("multer");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./tmp");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});
const filefilter = (req, file, cb) => {
    if (
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
let upload = multer({
    storage: storage,
    fileFilter: filefilter,
});

module.exports = upload;