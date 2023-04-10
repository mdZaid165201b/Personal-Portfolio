const router = require("express").Router();
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");
const {createProject, updateProject, deleteProject} = require("../controller/project");

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

router.post("/create-project", makeUploadDir, upload.array("image", 10), createProject);

router.put("/update-project/:id", makeUploadDir, upload.array("image", 10), updateProject)

router.delete("/delete-project/:id", deleteProject)

module.exports = router;
