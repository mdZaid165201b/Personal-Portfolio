const cloudinary = require("cloudinary").v2;

const deleteImages = async (ids) => {
    try{
        if(Array.isArray(ids)){
            const promiseArr = [];
            for(const id of ids){
                const result = cloudinary.uploader.destroy(id);
                promiseArr.push(result);
            }
            const result = await  Promise.all(promiseArr);
            if(result[0].result) return true;
            return  false;
        }
        else{
            const {result}  = await cloudinary.uploader.destroy(ids);
            return result;
        }
    }
    catch (err) {
        return err;
    }
}

module.exports = deleteImages;