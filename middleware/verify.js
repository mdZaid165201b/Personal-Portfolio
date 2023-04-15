const jwt = require("jsonwebtoken");

const verifyToekn = async(req, res, next) => {
    try{
        if(req.headers.token) {
            const token = req.headers.token.split(" ")[1];
            const result = await jwt.verify(token, process.env.JWTTOKEN);
            req.user = result;
            next();
        }
        else{
            res.status(404).json({
                success: false,
                message: "token required!!!"
            })
        }


    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = verifyToekn;