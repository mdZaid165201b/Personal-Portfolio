const router = require("express").Router();
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");
const {createProject, updateProject, deleteProject, findProject, findProjects} = require("../controller/project");
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

router.post("/create-project", makeUploadDir, multerMiddleware.array("image", 10), createProject);

router.put("/update-project/:id", makeUploadDir, multerMiddleware.array("image", 10), updateProject);

router.delete("/delete-project/:id", deleteProject);

router.get("/get-projects", findProjects);

router.get("/get-project/:id", findProject);

module.exports = router;
