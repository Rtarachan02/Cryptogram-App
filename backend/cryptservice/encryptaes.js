import crypto from 'crypto'
function encryptAESKeyWithRSA(aesKey, rsaPublicKey) {
  const receiverPubKey = crypto.createPublicKey(rsaPublicKey);
  const encryptedAESKey = crypto.publicEncrypt(
    {
      key: receiverPubKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    Buffer.from(aesKey)
  );
  return encryptedAESKey;
}

export default encryptAESKeyWithRSA;
