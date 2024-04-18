import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import EncAES from "../models/enc_aes.model.js";
import { getReceiverSocketId ,io} from "../socket/socket.js";
import crypto from 'crypto';
import encryptAESKeyWithRSA from "../cryptservice/encryptaes.js";
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
         const senderEnc = encryptAESKeyWithRSA(aesKey,recipent.rsaPub);
         const receiverEnc=encryptAESKeyWithRSA(aesKey,req.user.rsaPub);
        
         const newEncAES = new EncAES({
              senderId,
              receiverId,
              senderEnc,
              receiverEnc,
               });
               try {
                await newEncAES.save();
               } catch (error) {
                console.log("Error",error.message);
               }
          }
    const newMessage = new Message({
             senderId,
             receiverId,
             message
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

    resp.status(201).json(newMessage);
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