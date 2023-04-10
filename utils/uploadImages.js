const cloudinary = require("cloudinary").v2;

const uploadImages = async (files) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    try{
        const promiseArr = [];

        for (const file of files) {
            const image_promise = cloudinary.uploader.upload(file.path, options);
            promiseArr.push(image_promise);
        }

        const result = await Promise.all(promiseArr);
        return  result;
    }
    catch (err) {
        return err.message
    }
}

module.exports = uploadImages;