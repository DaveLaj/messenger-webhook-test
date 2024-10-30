import axios from 'axios';

/**
 * Sends a message reply
 * @param {string} message Message to send
 * @param {string} recipientID recipientID
 * @param {string} pageAccessToken Page access token
 * @returns {Promise<void>}
 */
async function sendTextMessage(message, recipientID, pageAccessToken) {
    try {
        const clientInstance = axios.create({
            baseURL: "https://graph.facebook.com/v21.0/",
        });

        const payload = {
                recipient: { id: Number(recipientID) },
                message: { text: message },
                messaging_type: "RESPONSE",
        }

        const result = await clientInstance.post(`me/messages`, payload, {
            params: {
                "access_token": pageAccessToken
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        const status = result?.status;
        if (status === undefined) {
            throw new Error("Status not found");
        }
        if (status !== 200) {
            throw new Error("Status is not 200"); 
        }
    } catch (error) {
        if (!(error instanceof Error)) {
            return;
        }
        throw new Error(`Message failed to send: ${error.message}`);
    }
}

export { 
    sendTextMessage
}