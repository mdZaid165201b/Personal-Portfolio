const User = require("../model/User");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const users = await User.find({});
    if (users.length >= 1) {
      const foundUser = await User.find({ email });
      if (foundUser) {
        res
          .status(404)
          .json({ success: false, message: "user already exist!!!" });
      } else {
        res
          .status(404)
          .json({ success: false, message: "user already exist!!!" });
      }
    } else {
      const hashedPassword = cryptoJs.AES.encrypt(
        password,
        process.env.PASSWORD_SECRET
      );
      const userObject = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await userObject.save();
      res.status(201).json({ success: true, message: "user created!!!" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (userFound) {
      let decryptedPassword = cryptoJs.AES.decrypt(
        userFound.password,
        process.env.PASSWORD_SECRET
      );
      decryptedPassword = decryptedPassword.toString(cryptoJs.enc.Utf8);
      if (decryptedPassword === password) {
        const token = jwt.sign(
          { id: userFound._id, email: userFound.email },
          process.env.JWTTOKEN
        );

        const { password, ...remaining } = userFound._doc;
        res.status(200).json({
          success: true, 
          remaining,
          token
        })
      }
      else{
        res.status(404).json({success: false, message: "invalid password!!!"})
      }
    }
    else{
      res.status(404).json({success: false, message: "user not found!!!"})
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  register,
  login,
};
