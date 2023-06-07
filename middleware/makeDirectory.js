const fs = require("fs");

const makeDirectory = (req, res, next) => {
    if(!fs.existsSync("./tmp")){
        fs.mkdirSync("./tmp", {recursive: true}, (err) => {
            console.log(err)
        })
    }
    next();
}

module.exports = makeDirectory;