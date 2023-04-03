const router = require("express").Router();
const { createProject } = require("../controller/project");
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");

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
  
  router.post(
    "/create-project",
    makeUploadDir,
    upload.array("image", 10),
    createProject
  );

module.exports = router;
