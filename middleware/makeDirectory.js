const fs = require("fs");

const makeDirectory = (req, res, next) => {
    if(!fs.existsSync("./mytmp")){
        console.log("direcroy not found!!! makeDirectory middleware if part run")
        fs.mkdirSync("./mytmp", {recursive: true}, (err) => {
            console.log(err)
        })
    }
    else{
        console.log("no file exist else part")
    }
    next();
}

module.exports = makeDirectory;