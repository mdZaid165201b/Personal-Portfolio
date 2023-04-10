const router = require("express").Router();
const { register, login, updateUser, findUser } = require("../controller/user");
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");
const multerMiddleware = require("../middleware/multerMiddleware");
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


router.post("/register", register);

router.post("/login", login);

router.put("/update-user/:id",makeUploadDir, multerMiddleware.single("image"), updateUser);

router.get("/get-user/:id", findUser);

module.exports = router;

