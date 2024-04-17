import { error } from "console";
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { generateRSAKeyPair } from "../cryptservice/rsakeygen.js";
export const signup = async(req,res) => {
    // res.send("Hello");
    // console.log("signupUser");
    try {
        const {fullName,username,password,confirmPassword,gender} = req.body;
        if(password !== confirmPassword) {   
            return res.status(400).json({error:"Passwords do not match."});
           }
       const user = await User.findOne({username});
       if(user)
       return res.status(400).json({error:"User already Exists."});
           //hasing the password here
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(password,salt);
           //avatar 
       const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
       const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

          ///cryptography parts
          const { privateKey, publicKey } = generateRSAKeyPair();


       const newUser = new User({
        fullName,
        username,
        password :hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        rsaPub:publicKey,
       });
       //lets make more secure here
       if(newUser){
       generateTokenAndSetCookie(newUser._id,res);
       await newUser.save();
       res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          password: newUser.password,
          gender: newUser.gender,
          profilePic: newUser.profilePic,
       });}
       else{
        res.status(400).json({error:"Invalid User Data"});
       }

    } 
     catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Internal Server demo Error"});
      }
};

export const login = async(req,res) => {
    // console.log("loginUser");
    try {
        const {username,password} =req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect)
           return res.status(400).json({error:"Invalid Username or Password"});
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id :user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic
        });

    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Internal Server demo Error"}); 
    }
};

export const logout = (req,res) => {
    // console.log("logoutUser");
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout Successfully."});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({error:"Internal Server demo Error"}); 
    }
};
// export default signup;