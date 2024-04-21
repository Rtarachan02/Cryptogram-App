import crypto from 'crypto'
function encryptAESKeyWithRSA(aesKey, rsaPublicKey) {
 try {
  const receiverPubKey = crypto.createPublicKey(rsaPublicKey);
  const encryptedAESKey = crypto.publicEncrypt(
    {
      key: receiverPubKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    Buffer.from(aesKey)
  );
  return encryptedAESKey;
 } catch (error) {
     console.error("Error encrypting AES key:", error);
 }
}

export default encryptAESKeyWithRSA;
