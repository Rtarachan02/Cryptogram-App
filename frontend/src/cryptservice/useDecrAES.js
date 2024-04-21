import { useEffect, useState } from 'react';
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
const useDecrAES = () => {
  const [decryptedAESKey, setDecryptedAESKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useConversation();
  useEffect(() => {
      if (selectedConversation?._id) {
          const fetchDecrAES = async () => {
              setLoading(true);
              try {
                  const res = await fetch(`/api/decraes/${selectedConversation._id}`, {
                      method: 'POST',
                      headers: { "Content-Type": "application/json" },
                  });
                  const keydataAES = await res.json();
                  if (keydataAES.error) {
                      throw new Error(keydataAES.error);
                  }
                  setDecryptedAESKey(keydataAES);
                  console.log("Decrypted AES Key:", keydataAES);
              } catch (error) {
                  toast.error(error.message);
              } finally {
                  setLoading(false);
              }
          };

          fetchDecrAES();
      } else {
          setKey(null);
          setLoading(false);
      }
  }, [selectedConversation._id]);

  return { decryptedAESKey, loading };
};

export default useDecrAES;
