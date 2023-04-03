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
      
      const result = await Promise.all(promiseArr);
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
    const response = await finalObject.save();

    res.status(201).json({success: true, response});
  
} catch (err) {
    res.status(500).json(err.message);
  }
};



module.exports = {
  createProject,
};
