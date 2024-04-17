import mongoose from 'mongoose'

const rsaSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    rsaPri:{
        type:String,
        required:true
    },
},{timestamps:true}
)

const RSA = mongoose.model("RSA",rsaSchema);
export default RSA;