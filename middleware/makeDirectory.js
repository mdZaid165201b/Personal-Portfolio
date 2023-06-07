const fs = require("fs");

const makeDirectory = (req, res, next) => {
    if(!fs.existsSync("./tmp")){
        console.log("direcroy not found!!! makeDirectory middleware if part run")
        fs.mkdirSync("./tmp", {recursive: true}, (err) => {
            console.log(err)
        })
    }
    else{
        console.log("no file exist else part")
    }
    next();
}

module.exports = makeDirectory;