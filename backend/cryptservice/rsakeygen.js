import crypto from 'crypto';

export function generateRSAKeyPair() {
    // Generate RSA key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // The length of the RSA modulus in bits
        publicKeyEncoding: {
            type: 'pkcs1', // PKCS#1 (traditional RSA) format for public key
            format: 'pem' // Output format
        },
        privateKeyEncoding: {
            type: 'pkcs1', // PKCS#1 (traditional RSA) format for private key
            format: 'pem' // Output format
        }
    });

    return { privateKey, publicKey };
}
