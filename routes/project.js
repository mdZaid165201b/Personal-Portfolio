const router = require("express").Router();
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");
const {createProject, updateProject, deleteProject, findProject, findProjects} = require("../controller/project");
const multerMiddleware = require("../middleware/multerMiddleware");


router.post("/create-project", makeUploadDir, multerMiddleware.array("image", 10), createProject);

router.put("/update-project/:id", makeUploadDir, multerMiddleware.array("image", 10), updateProject);

router.delete("/delete-project/:id", deleteProject);

router.get("/get-projects", findProjects);

router.get("/get-project/:id", findProject);

module.exports = router;
