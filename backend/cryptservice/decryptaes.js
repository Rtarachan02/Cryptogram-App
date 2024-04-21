import crypto from 'crypto'
function decryptAESKeyWithRSA(encryptedAESKey, rsaPrivateKey) {
    try {
        const privateKey = crypto.createPrivateKey(rsaPrivateKey);
     // Ensure encryptedAESKey is in the correct format
    const encryptedData = typeof encryptedAESKey === 'string' ? Buffer.from(encryptedAESKey, 'hex') : encryptedAESKey;
        // Decrypt the AES key using the private key
        const decryptedAESKey = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
            },
            encryptedData

        );
        // console.log("decryptedAESKey",decryptedAESKey);
             return decryptedAESKey;    
    } catch (error) {
        console.error("Error decrypting AES key:", error);
            return null;
    }
}

export default decryptAESKeyWithRSA;