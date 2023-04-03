const fs = require("fs");

const makeDirectory = (req, res, next) => {
    if(!fs.existsSync("./tmp")){
        fs.mkdirSync("./tmp", {recursive: true})
    }
    next();
}

module.exports = makeDirectory;