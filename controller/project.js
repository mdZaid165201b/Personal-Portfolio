const Project = require("../model/Project");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const deleteImages = require("../utils/deleteImages");
const uploadImages = require("../utils/uploadImages");

//-----------------------------------------Cloudinary Configuration--------------------------------------
// cloudinary.config({
//   cloud_name: process.env.CLOUDNAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });
//-----------------------------------------End of Cloudinary Configuration--------------------------------------


const createProject = async (req, res, next) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    try {
        const promiseArr = [];
        for (const file of req.files) {
            const result = cloudinary.uploader.upload(file.path, options);
            promiseArr.push(result);
        }

        const result = await Promise.all(promiseArr);
        // fs.rmdir("./uploads", { recursive: true }, (err) => {
        //   if (err) {
        //     console.error(err);
        //   }
        // });
        fs.rm("./tmp", {recursive: true}, (err) => {
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

        const newProject = {
            projectName: req.body.projectName,
            assign: req.body.assign,
            status: req.body.status,
            deadline: req.body.deadline,
            description: req.body.description,
            coverImage: {
                id: result[0].public_id,
                url: result[0].secure_url,
            },
            projectImages: imagesUrlArr,
        };
        const projectfinal = new Project(newProject);
        const responseData = await projectfinal.save();
        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err,
        });
    }
};
const updateProject = async (req, res, next) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    try {
        let {images} = req.body;
        let updatedProjectObject;
        const fetchedProject = await Project.findById(req.params.id);
        let isImagesDeleted = false;
        if (fetchedProject) {
            if (images !== undefined && req.files.length === 0) {
                console.log("only images for deletion provided!!!");
                if (!Array.isArray(images)) {
                    images = [images]
                }
                const delete_response = await deleteImages(images);
                if (delete_response) {
                    let updatedImagesArray;
                    updatedImagesArray = fetchedProject.projectImages.filter((current, index) => {
                        if (!images.includes(current.id)) return true;
                    })
                    updatedProjectObject = {
                        projectName: req.body.projectName === undefined ? fetchedProject.projectName : req.body.projectName,
                        status: req.body.status === undefined ? fetchedProject.status : req.body.status,
                        assign: req.body.assign === undefined ? fetchedProject.assign : req.body.assign,
                        deadline: req.body.deadline === undefined ? fetchedProject.deadline : req.body.deadline,
                        description: req.body.description === undefined ? fetchedProject.description : req.body.description,
                        projectImages: updatedImagesArray,
                        coverImage: updatedImagesArray.length >= 0 ? {
                            id: updatedImagesArray[0]['id'],
                            url: updatedImagesArray[0]['url']
                        } : {}
                    }
                    const finalResponse = await Project.findByIdAndUpdate(req.params.id, updatedProjectObject, {new: true});
                    console.log("successfully deleted!!!")
                    res.status(201).json({
                        success: true,
                        finalResponse
                    });
                    isImagesDeleted = true;
                } else {
                    res.status(500).json({
                        success: false,
                        message: "image deletion error!!!"
                    })
                }
            } else if ((images !== undefined) && (req.files.length >= 0)) {
                console.log("images for deletion and files for uploading also provided!!!")
                if (!Array.isArray(images)) images = [images];
                const delete_response = await deleteImages(images);
                let updatedImagesArray;
                if (delete_response) {
                    updatedImagesArray = fetchedProject.projectImages.filter((current, index) => {
                        if (!images.includes(current.id)) return true;
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: "image deletion error!!!"
                    })
                }

                if (req.files.length >= 0) {

                    const result = await uploadImages(req.files);
                    fs.rm("./tmp", {recursive: true}, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    const imagesUrlArr = [];
                    for (const imageObj of result) {
                        imagesUrlArr.push({
                            id: imageObj.public_id,
                            url: imageObj.secure_url,
                        });
                    } // end of image uploading task
                    updatedImagesArray = [...updatedImagesArray, ...imagesUrlArr];
                }

                const updatedProjectObject = {
                    projectName: req.body.projectName === undefined ? fetchedProject.projectName : req.body.projectName,
                    status: req.body.status === undefined ? fetchedProject.status : req.body.status,
                    assign: req.body.assign === undefined ? fetchedProject.assign : req.body.assign,
                    deadline: req.body.deadline === undefined ? fetchedProject.deadline : req.body.deadline,
                    description: req.body.description === undefined ? fetchedProject.description : req.body.description,
                    projectImages: updatedImagesArray,
                    coverImage: updatedImagesArray.length >= 0 ? {
                        id: updatedImagesArray[0]['id'],
                        url: updatedImagesArray[0]['url']
                    } : {}
                }
                const final_response = await  Project.findByIdAndUpdate(req.params.id, updatedProjectObject, {new: true})
                res.status(201).json({
                    success: true,
                    final_response
                });
            } else if (req.files.length >= 0) {
                const result = await uploadImages(req.files);
                fs.rm("./tmp", {recursive: true}, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                const imagesUrlArr = [];
                for (const imageObj of result) {
                    imagesUrlArr.push({
                        id: imageObj.public_id,
                        url: imageObj.secure_url,
                    });
                } // end of image uploading task
                const updatedImagesArray = [...fetchedProject.projectImages, ...imagesUrlArr];
                const updatedProjectObject = {
                    projectName: req.body.projectName === undefined ? fetchedProject.projectName : req.body.projectName,
                    status: req.body.status === undefined ? fetchedProject.status : req.body.status,
                    assign: req.body.assign === undefined ? fetchedProject.assign : req.body.assign,
                    deadline: req.body.deadline === undefined ? fetchedProject.deadline : req.body.deadline,
                    description: req.body.description === undefined ? fetchedProject.description : req.body.description,
                    projectImages: updatedImagesArray,
                    coverImage: updatedImagesArray.length >= 0 ? {
                        id: updatedImagesArray[0]['id'],
                        url: updatedImagesArray[0]['url']
                    } : {}
                }
                const final_response = await  Project.findByIdAndUpdate(req.params.id, updatedProjectObject, {new: true});
                res.status(201).json({
                    success: true,
                    final_response
                })
            }

            else if((req.files.length === 0) && (images === undefined)){
                const updatedProjectObject = {
                    projectName: req.body.projectName === undefined ? fetchedProject.projectName : req.body.projectName,
                    status: req.body.status === undefined ? fetchedProject.status : req.body.status,
                    assign: req.body.assign === undefined ? fetchedProject.assign : req.body.assign,
                    deadline: req.body.deadline === undefined ? fetchedProject.deadline : req.body.deadline,
                    description: req.body.description === undefined ? fetchedProject.description : req.body.description,
                }
                res.status(201).json({
                    success: true,
                    updatedProjectObject
                })
            }

        }
        else {
            res.status(404).json({
                success: false,
                message: "project not found!!!"
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "internal server error",
            error: err.message,
        });
    }
};

const deleteProject = async  (req, res, next) => {
    try{
        const fetchedProject = await Project.findById(req.params.id);
        if(fetchedProject){
            const imagesIDS = [];
            for(const image of fetchedProject.projectImages){
                imagesIDS.push(image.id);
            }
            const delete_response = await deleteImages(imagesIDS);
            if(delete_response) {
                await Project.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    success: true,
                    message: "project deleted successfully!!!"
                })
            }
            else{
                res.status(500).json({
                    success: false,
                    message: "image deletion error!!!"
                })
            }
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const findProjects = async (req, res, next) => {
    try{
        const projects = await Project.find({}).sort({deadline: -1});
        res.status(200).json({
            success: true,
            projects
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const findProject = async (req, res, next) => {
    try{
        const fetchedProject = await Project.findById(req.params.id);
        if(fetchedProject){
            res.status(200).json({
                success: true,
                fetchedProject
            })
        }
        else{
            res.status(404).json({
                success: false,
                message: "project not found!!!"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    createProject,
    updateProject,
    deleteProject,
    findProjects,
    findProject
};
