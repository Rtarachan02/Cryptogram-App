import { useEffect, useState } from 'react';
import { useAuthContext } from "../../contexts/AuthContext";
import useDecrAES from '../../cryptservice/useDecrAES';
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import useDecryptMessage from '../../cryptservice/useDecryptMessage';
const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const [loading,setLoading] =useState(false);
    const [decryptedMessage, setDecryptedMessage] = useState("Decrypting message...");
    const [decryptionError, setDecryptionError] = useState(null);
    const { decryptedAESKey, loading: decrLoading } = useDecrAES();
    const {decrMsg,loading:decrMsgLoading} = useDecryptMessage(message.message);
    useEffect(() => {
            setLoading(true);
           if (decrLoading || !decryptedAESKey || decrMsgLoading) 
                     return;
            try {
                const decryptedmsg = decrMsg;
                if (decryptedmsg.error) throw new Error(decryptedmsg.error);
                setDecryptedMessage(decryptedmsg);
            } catch (error) {
                setDecryptionError(error.message);
            }
            finally{
                setLoading(false);
            }
    }, [decryptedAESKey, message.message, decrLoading,decrMsgLoading]);

    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "";
    const shakeClass = message.shouldShake ? "shake" : "";

    return (
        <div className={`chat ${chatClassName}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='Profile' src={profilePic} />
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
            {decryptionError ? decryptionError : 
        typeof decryptedMessage === 'object' ? 
        JSON.stringify(decryptedMessage) : decryptedMessage
    }
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
        </div>
    );
};

export default Message;
