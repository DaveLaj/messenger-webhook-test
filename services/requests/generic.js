import axios from 'axios';

/**
 * Sends a generic template message (you can add buttons, images, etc to be sent)
 * @param {object} elements elements to decorate the template
 * @param {string} PSID PSID of the user
 * @param {string} pageAccessToken Page access token
 * @returns {Promise<void>}
 */
async function sendGenericRequest(elements, PSID, pageAccessToken) {
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
                    "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }
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
        throw new Error(`Generic request failed to send: ${error.message}`);
    }
}

export {
    sendGenericRequest
}