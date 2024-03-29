const router = require("express").Router();
const multer = require("multer");
const makeUploadDir = require("../middleware/makeDirectory");
const {createProject, updateProject, deleteProject, findProject, findProjects} = require("../controller/project");
const multerMiddleware = require("../middleware/multerMiddleware");
const verify = require("../middleware/verify");

router.post("/create-project",verify , multerMiddleware.array("image", 40), createProject);

router.put("/update-project/:id",verify , multerMiddleware.array("image", 40), updateProject);

router.delete("/delete-project/:id",verify ,deleteProject);

router.get("/get-projects",findProjects);

router.get("/get-project/:id", findProject);

module.exports = router;
