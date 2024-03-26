import mongoose from 'mongoose';
import { stringify } from 'querystring';

const userSchema = new mongoose.Schema({
        fullName:{
             type:String,
             required:true
        },
        username:{
            type:String,
            required:true,
             unique:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        gender:{
            type:String,
            required:true,
            enum:["male","female"]
        },
        profilePic:{
            type:String,
            default:""
        },
},//show created at ,updated at =.member since =>created At
{timestamps:true});

const User = mongoose.model("User",userSchema);
export default User;