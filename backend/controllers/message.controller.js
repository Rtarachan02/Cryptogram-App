import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import RSA from "../models/rsapr.model.js"
import EncAES from "../models/enc_aes.model.js";
import { getReceiverSocketId ,io} from "../socket/socket.js";
import crypto from 'crypto';
import encryptAESKeyWithRSA from "../cryptservice/encryptaes.js";
import decryptAESKeyWithRSA from "../cryptservice/decryptaes.js";
// import { getEncAES } from "./encAES.controller.js";
import encryptMessageWthAESKey from "../cryptservice/encryptMessage.js";
export const sendMessage = async(req,resp) => {
    // console.log("Message Sent!",req.params.id)
    try {
        const {message} = req.body;
        const {id:receiverId} =req.params;//aliasing
        const senderId=req.user._id;

      let conversation =  await Conversation.findOne({
            participants: {$all:[senderId,receiverId]},
        });
        if(!conversation || !conversation.messages)
          { 
            conversation = await Conversation.create({
                participants: [senderId,receiverId]
                });
         //cryptography part will be going at here:
        
         const recipent = await User.findOne({_id:receiverId});
         const aesKey = crypto.randomBytes(32);
         console.log("aesKeyLength",aesKey.length);
         const senderEnc = encryptAESKeyWithRSA(aesKey,req.user.rsaPub);
         const receiverEnc=encryptAESKeyWithRSA(aesKey,recipent.rsaPub);
         const newEncAES = new EncAES({
              senderId,
              receiverId,
              senderEnc :senderEnc.toString('hex'),
              receiverEnc:receiverEnc.toString('hex'),
               });
               try {
                await newEncAES.save();
                console.log("Encrypted AES key saved successfully");
               } catch (error) {
                console.log("Error",error.message);
               }
          }
    //encypt the message with aes key at here
    const encrAESkEY = await (async (req, resp) => {
        try {
            const { id: receiverId } = req.params; // aliasing
            const senderId = req.user._id;
            const keydata =  await EncAES.findOne({
                $or: [
                  { senderId: senderId, receiverId: receiverId },
                  { senderId: receiverId, receiverId: senderId }
                ]
              });
            if (!keydata) {
                resp.status(404).json({ error: "AES sender Key data not found" });
                return null;
            }
            const encAESkey = (String(keydata.senderId) === String(senderId) )? keydata.senderEnc : keydata.receiverEnc;
        //    return  resp.status(200).json(encAESkey);
            return encAESkey;
        } catch (error) {
            console.log("Error in getEncAES functionality. ", error);
            resp.status(500).json({ error: "Internal Server Error" });
            return null;
        }
    })(req, resp);
    
    const rsadata = await RSA.findOne({ userId: senderId });
    if (!rsadata) {
        throw new Error("RSA data not found");
    }
    const rsaPrivateKey = rsadata.rsaPri;
    if (!rsaPrivateKey) {
        throw new Error("RSA private key not found");
    }
    const decryptedAESKey = decryptAESKeyWithRSA(encrAESkEY,rsaPrivateKey);
    console.log("decryptedAESKeyLength",decryptedAESKey.length);
    const encryptedMessage = encryptMessageWthAESKey(message,decryptedAESKey);
    const newMessage = new Message({
             senderId,
             receiverId,
             message : encryptedMessage,
    });
    if(newMessage)
        {
            conversation.messages.push(newMessage._id);
        }
     // await conversation.save();
    // await newMessage.save();
    //below will run in parallel
    await Promise.all([conversation.save(),newMessage.save()]);
    //SOCKET_IO FUNCTIONALITY GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        // io.to(<socket_id>).emit() used to send events to specific client
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }
          return resp.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage Controller :",error.message);
        resp.status(500).json({error:"Internal Server Error"});
    }
}
export const getMessage = async(req,resp) =>{
    try {
        const {id:userToChatId} =req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all:[senderId,userToChatId]},
        }).populate("messages");
        if(!conversation)
            return  resp.status(200).json([]);
        const messages =conversation.messages;//just an optimization
        resp.status(200).json(messages);
    } catch (error) {
        console.log("Error in sendMessage Controller :",error.message);
        resp.status(500).json({error:"Internal Server Error"});
    }
}