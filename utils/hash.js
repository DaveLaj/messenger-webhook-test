import crypto from 'crypto';

/**
 * Hashes a string using a secret key
 * @param {string} string string to hash
 * @param {string} key secret key
 * @returns {Promise<string>} signed string
 */
async function getHash(string, key) {
    try {
        const hmac = crypto.createHmac("sha256", key);
        const signed = hmac.update(string).digest("hex");
        return signed;
    } catch (error) {
        if (!(error instanceof Error)) {
            return "";
        }
        throw new Error(`Hashing failed: ${error.message}`);
    }
}

export {
    getHash
};
