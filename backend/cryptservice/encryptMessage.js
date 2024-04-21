import crypto from 'crypto';
function encryptMessageWithAESKey(message, aesKey) {
    try {
        // Convert the AES key and message to buffers
        const aesKeyBuffer = Buffer.from(aesKey, 'hex');
        const messageBuffer = Buffer.from(message, 'utf8');
        // Check if the AES key has the correct length (32 bytes for AES-256)
        if (aesKeyBuffer.length !== 32) {
            console.log(aesKeyBuffer.length);
            console.error('Invalid AES key length. It should be 32 bytes (256 bits).');
            throw new Error('Invalid AES key length. It should be 32 bytes (256 bits).');
        }
        // Create a cipher object with the AES key
        const cipher = crypto.createCipheriv('aes-256-cbc', aesKeyBuffer, aesKeyBuffer.slice(0, 16)); // Assuming IV length is 16 bytes

        // Encrypt the message 
        let encryptedData = cipher.update(messageBuffer);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);

        // Convert the encrypted data to a hexadecimal string
        const encryptedHex = encryptedData.toString('hex');

        return encryptedHex;
    } catch (error) {
        console.error("Error encrypting message:", error);
        return null;
    }
}

export default encryptMessageWithAESKey;