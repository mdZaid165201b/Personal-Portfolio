const jwt = require("jsonwebtoken");

const verifyToekn = async(req, res, next) => {
    try{
        console.log(req.headers);
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = verifyToekn;