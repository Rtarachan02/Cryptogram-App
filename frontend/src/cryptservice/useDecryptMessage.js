import React, { useEffect, useState } from "react";
import useDecrAES from "./useDecrAES";
import toast from "react-hot-toast";
const useDecryptMessage = (encmessage) => {
    const [loading, setLoading] = useState(false);
    const [decrMsg,setDecrMsg] =useState("Decrypting.....");
    const { decryptedAESKey } = useDecrAES();
    useEffect(() => {
        const decryptMessage = async () => {
            setLoading(true);
            try { 
                if (encmessage && decryptedAESKey) {
                    const requestBody = {
                        encmessage,
                        decryptedAESKey
                    };
                    console.log("Request Body:", requestBody);
                    const res = await fetch(`/api/decrmsg`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(requestBody),
                    });
                    const msgdata = await res.json();
                    if (msgdata.error) throw new Error(msgdata.error);
                    console.log("Decrypted Message:", msgdata);
                    setDecrMsg(msgdata);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        decryptMessage();
    }, [encmessage,decryptedAESKey]); 
    return { decrMsg,loading };
};
export default useDecryptMessage;
