const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verfiyToken");
const multer  = require('multer');
const appError = require("../utils/appError");

const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split("/")[0];
    if(imageType === "image"){
        return cb(null,true)
    }else{
        return cb(appError.create("file must be an image",400),false)
    }
}
const upload = multer({ storage:multer.memoryStorage(),fileFilter })
router.route("/").get(verifyToken,usersController.getAllUsers);
router.route("/register").post(upload.single('avatar'),usersController.register);
router.route("/login").post(usersController.login);

module.exports = router;
