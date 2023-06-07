const User = require("../model/User");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const deleteImage = require("../utils/deleteImages");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
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
    } else {
      res.status(404).json({
        success: false,
        message: "user already exist!!!",
      });
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
          token,
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "invalid password!!!" });
      }
    } else {
      res.status(404).json({ success: false, message: "user not found!!!" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const logout = async (req, res, next) => {
  try{
    const expiredToken = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWTTOKEN, {expiresIn: "120"})
    req.headers.token = null;
  }
  catch(err){
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const updateUser = async (req, res, next) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    const fetchedUser = await User.findById(req.params.id);
    if (fetchedUser) {
      let profileImage;
      if (req.file) {
        // when profile image provided
        const image_response = await cloudinary.uploader.upload(
          req.file.path,
          options
        );
        profileImage = {
          id: image_response.public_id,
          url: image_response.secure_url,
        };
        const delete_response = await deleteImage(fetchedUser.profilePic["id"]);
        if (!delete_response) {
          res
            .status(400)
            .json({ success: false, message: "image deletion error!!!" });
        }
        fs.rm("./mytmp", { recursive: true }, (err) => {
          if (err) {
            console.log(err);
          }
        });
        const updatedUserObject = {
          firstName:
            req.body.firstName === undefined
              ? fetchedUser.firstName
              : req.body.firstName,
          lastName:
            req.body.lastName === undefined
              ? fetchedUser.lastName
              : req.body.lastName,
          tagLine:
            req.body.tagLine === undefined
              ? fetchedUser.tagLine
              : req.body.tagLine,
          email:
            req.body.email === undefined ? fetchedUser.email : req.body.email,
          githubLink:
            req.body.githubLink === undefined
              ? fetchedUser.githubLink
              : req.body.githubLink,
          facebookLink:
            req.body.facebookLink === undefined
              ? fetchedUser.facebookLink
              : req.body.facebookLink,
          linkedinLink:
            req.body.linkedinLink === undefined
              ? fetchedUser.linkedinLink
              : req.body.linkedinLink,
          profilePic: req.file !== undefined ? profileImage : {},
        };
        const remaining = await User.findByIdAndUpdate(
          req.params.id,
          updatedUserObject,
          { new: true }
        );
        res.status(201).json({
          success: true,
          remaining,
        });
      } else if (req.file === undefined) {
        fs.rm("./mytmp", { recursive: true }, (err) => {
          if (err) {
            console.log(err);
          }
        });

        const updatedUserObject = {
          firstName:
            req.body.firstName === undefined
              ? fetchedUser.firstName
              : req.body.firstName,
          lastName:
            req.body.lastName === undefined
              ? fetchedUser.lastName
              : req.body.lastName,
          tagLine:
            req.body.tagLine === undefined
              ? fetchedUser.tagLine
              : req.body.tagLine,
          email:
            req.body.email === undefined ? fetchedUser.email : req.body.email,
          githubLink:
            req.body.githubLink === undefined
              ? fetchedUser.githubLink
              : req.body.githubLink,
          facebookLink:
            req.body.facebookLink === undefined
              ? fetchedUser.facebookLink
              : req.body.facebookLink,
          linkedinLink:
            req.body.linkedinLink === undefined
              ? fetchedUser.linkedinLink
              : req.body.linkedinLink,
        };
        const remaining = await User.findByIdAndUpdate(
          req.params.id,
          updatedUserObject,
          { new: true }
        );
        res.status(201).json({
          success: true,
          remaining,
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "user not found!!!",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const findUser = async (req, res, next) => {
  try {
    const fetchedUser = await User.findById(req.params.id);
    if (fetchedUser) {
      const { password, ...other } = fetchedUser._doc;
      res.status(200).json({
        success: true,
        other,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "user not found!!!",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserInfo = async(req, res, next) => {
  try{
    const user = await User.find();
    if(user) {
      const {password, ...other} = user[0]._doc;
      res.status(200).json({
        success: true,
        user: other
      })
    }
    else {
      res.status(404).json({
        success: false,
        message: "no user found!!!"
      })
    }
    
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

module.exports = {
  register,
  login,
  logout,
  updateUser,
  findUser,
  getUserInfo
};
