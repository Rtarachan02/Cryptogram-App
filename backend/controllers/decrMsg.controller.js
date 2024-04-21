import crypto from 'crypto';

export const getDecrMsg = async (req, resp) => {
    try {
        const {encmessage: enmessage, decryptedAESKey:aeskey } = req.body;
        // Convert the AES key and encrypted message from hexadecimal strings to buffers
        const aesKeyBuffer = Buffer.from(aeskey, 'hex');
        const encryptedData = Buffer.from(enmessage, 'hex');
        // Check if the AES key has the correct length (32 bytes for AES-256)
        if (aesKeyBuffer.length !== 32) {
            console.error('Invalid AES key length. It should be 32 bytes (256 bits).');
            throw new Error('Invalid AES key length. It should be 32 bytes (256 bits).');
        }
        // Create a decipher object with the AES key
        const decipher = crypto.createDecipheriv('aes-256-cbc', aesKeyBuffer, aesKeyBuffer.slice(0, 16));
        // Decrypt the message
        let decryptedData = decipher.update(encryptedData);
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        // Convert the decrypted data from a buffer to a UTF-8 encoded string
        const decryptedMessage = decryptedData.toString('utf8');
        // Send the decrypted message in the response
        console.log("decryptedMessage", decryptedMessage);
        resp.status(200).json({ decryptedMessage });
    } catch (error) {
        console.error("Error decrypting message:", error);
        resp.status(500).json({ error: "Internal Server Error" });
    }
};
