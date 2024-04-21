import EncAES from "../models/enc_aes.model.js";
import RSA from "../models/rsapr.model.js";
import decryptAESKeyWithRSA from "../cryptservice/decryptaes.js";
export const getDecrAES = async (req,resp) => {
    try {
        const {id:receiverId} = req.params;//aliasing
        const senderId = req.user._id;
        //fetching the encrypted aes keys
        const keydata = await EncAES.findOne({
            $or: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId }
            ]
          });
        if (!keydata) {
            return resp.status(404).json({ error: " AES Key data not found" });
        }
        const encAESkey = (String(keydata.senderId) === String(senderId))? keydata.senderEnc : keydata.receiverEnc;
     //fetching the rsa private key
        const rsaKeyData = await RSA.findOne({userId:senderId});
        if (!rsaKeyData) {
            return resp.status(404).json({ error: " RSA Key data not found" });
        }
        const rsaPrivateKey = rsaKeyData.rsaPri;
        //decrypting the aes key
        const decrAESKey = decryptAESKeyWithRSA(encAESkey,rsaPrivateKey);
            return  resp.status(200).json(decrAESKey);
    } catch (error) {
        console.log("Error in getDecrAES controller ",error);
           return resp.status(500).json({error:"Internal Server Error"});
    }
}