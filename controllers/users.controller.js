const { validationResult } = require("express-validator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const User = require("../models/user.modul");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
    console.log(req.headers);

    const query = req.query;
    const limit = query.limit || 6;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const Users = await User.find({}, { __v: 0,password:0 }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { Users } });
});

const register = asyncWrapper(async (req, res,next) => {
    const { firstName, lastName, email, password,role } = req.body;
   const oldUser = await User.findOne({email})

   if (oldUser) {
    const error = appError.create("use already exists ",400, httpStatusText.FAIL );
    return next(error);
   }
   const HashedPassword =await bcrypt.hash(password,10);4

    const newUser = new User({ firstName, lastName, email, password:HashedPassword,role ,avatar:req.file.filename});
    // generate JWT token 
    const token = await generateJWT({email:newUser.email,id:newUser._id,role:newUser.role})
   newUser.token = token;
  
    await newUser.save();
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { user: newUser },
    }); 
});

const login = asyncWrapper( async (req,res,next) => {
    const {email, password } = req.body;
    
    if (!email && !password) {
        const error = appError.create("email and password required ",400,httpStatusText.FAIL );
    return next(error);
    }

    const user = await User.findOne({email});
    if (!user) {
        const error = appError.create("use not found ",400,httpStatusText.FAIL );
    return next(error);
    }

    const metchedPassword = await bcrypt.compare(password,user.password);
    const token = await generateJWT({email:user.email,id:user._id,role:user.role})

    if (user && metchedPassword) {
       return res.status(200).json({status:httpStatusText.SUCCESS,data:{token,role:user.role}})
    }else{
        const error = appError.create("not login ",500,httpStatusText.ERROR );
    return next(error);
    }

}

)
module.exports = {
    getAllUsers,
    register,
    login,
};
