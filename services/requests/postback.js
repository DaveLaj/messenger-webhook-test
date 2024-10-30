import axios from 'axios';

/**
 * Postback sending service
 * @param {object} postback postback template
 * @param {string} PSID PSID of the user
 * @param {string} pageAccessToken Page access token
 * @returns {Promise<void>}
 */
async function sendPostback(postback, PSID, pageAccessToken) {
    try {
        const clientInstance = axios.create({
            baseURL: "https://graph.facebook.com/v21.0/",
        });

        const payload = {
            "recipient": {
                "id": Number(PSID),
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": postback
                }
            }
        }

        const result = await clientInstance.post("me/messages", payload, {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                "access_token": pageAccessToken,
            }
        })

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
        throw new Error(`Postback failed to send: ${error.message}`);
    }
}

export { 
    sendPostback 
}
