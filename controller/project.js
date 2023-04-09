const Project = require("../model/Project");
const cloudinary = require('cloudinary').v2;
const fs = require("fs");

//-----------------------------------------Cloudinary Configuration--------------------------------------
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
//-----------------------------------------End of Cloudinary Configuration--------------------------------------

const createProject = async (req, res, next) => {
  //------------------------------Folder Config-----------------------------
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  //------------------------------End of Folder Config-----------------------------
  try {
    const promiseArr = [];
      for (file of req.files) {
        const result = cloudinary.uploader.upload(file.path, options);
        promiseArr.push(result);
      }
      console.log(req.files)
      const result = await Promise.all(promiseArr);
      // console.log("body : ",req.body);
      // console.log(result)
      fs.rm("./tmp", { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
      });
      const imagesUrlArr = [];
      for (imageObj of result) {
        imagesUrlArr.push({
          id: imageObj.public_id,
          url: imageObj.secure_url,
        });
      }

    const newProjectObj = {
        projectName: req.body.projectName,
        assign: req.body.assign,
        status: req.body.status,
        deadline: req.body.deadline,
        coverImage: {
            id: imagesUrlArr[0]['id'],
            url: imagesUrlArr[0]['url'],
        },
        projectImages: imagesUrlArr
    }

    const finalObject = new Project(newProjectObj);
      console.log(finalObject);
    const response = await finalObject.save();

    res.status(201).json({success: true, response});
  
} catch (err) {
    res.status(500).json(err.message);
  }
};

const updateProject = async(req, res, next) => {
    try{
        const { images, projectName, assign, status, deadline,  } = req.body;
        const fetchedProject = await  Project.findById(req.params.id);
        if(fetchedProject){
            
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "internal server error",
            error: err.message
        })
    }
}



module.exports = {
  createProject,
};
