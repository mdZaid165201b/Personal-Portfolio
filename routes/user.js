const router = require("express").Router();
const { register, login, updateUser, findUser } = require("../controller/user");
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");
const multerMiddleware = require("../middleware/multerMiddleware");



router.post("/register", register);

router.post("/login", login);

router.put("/update-user/:id",makeUploadDir, multerMiddleware.single("image"), updateUser);

router.get("/get-user/:id", findUser);

module.exports = router;

