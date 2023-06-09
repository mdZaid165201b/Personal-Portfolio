const router = require("express").Router();
const { register, login, updateUser, findUser, logout, getUserInfo } = require("../controller/user");
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");
const multerMiddleware = require("../middleware/multerMiddleware");
const verify = require("../middleware/verify");



router.post("/register", register);

router.post("/login", login);

router.post("/logout", verify,logout);


router.put("/update-user/:id",verify , multerMiddleware.single("image"), updateUser);

router.get("/get-user/:id" , findUser);

router.get("/user-info", getUserInfo);

module.exports = router;

