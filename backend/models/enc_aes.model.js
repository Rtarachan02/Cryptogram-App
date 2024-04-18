import mongoose from 'mongoose'

const enc_aesSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    senderEnc:{
        type:String,
        required:true,
    },
    receiverEnc:{
        type:String,
        required:true,
    }
},{timestamps:true}
)

const EncAES = mongoose.model("EncAES",enc_aesSchema);
export default EncAES;