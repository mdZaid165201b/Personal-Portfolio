const fs = require("fs");

const makeDirectory = (req, res, next) => {
    if(!fs.existsSync("./mytmp")){
        fs.mkdirSync("./mytmp", {recursive: true}, (err) => {
            console.log(err)
        })
    }
    next();
}

module.exports = makeDirectory;