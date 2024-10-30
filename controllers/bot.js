import { logError } from '../utils/logger.js';
import { getHash } from '../utils/hash.js';
import { sendTextMessage } from '../services/requests/message.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * Validates the Facebook webhook connection
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<void>}
 */
async function validateFBConnection(req, res) {
    try {
        const mode = req.query["hub.mode"];
        if (mode === undefined) {
            throw new Error("Mode not provided");
        }

        const token = req.query["hub.verify_token"];
        if (token === undefined) {
            throw new Error("Token not provided");
        }

        const challenge = req.query["hub.challenge"];
        if (challenge === undefined) {
            throw new Error("Challenge not provided");
        }

        const verifyToken = process.env.VERIFY_TOKEN;
        if (verifyToken === undefined) {
            throw new Error("Verify token not found");
        }

        // Checks if a token and mode is in the query string of the request
        if (mode && token) {
            // Checks the mode and token sent is correct
            if (mode === "subscribe" && token === verifyToken) {
                // Responds with the challenge token from the request
                if (challenge) {
                    console.log("CHALLENGE RECEIVED");
                    console.log(challenge);
                    res.status(200).send(challenge)
                    return;
                } else {
                    throw new Error("Challenge not found");
                }
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
                return;
            }
        }

        res.status(400).json(
            { 
                message: "Bad Request: Missing Request Query Parameters",
            }
        );
    } catch (error) {
        if (!res.headersSent) {
            res.sendStatus(500);
        }
        await logError(error);
    }
}

/**
 * Webhook POST Logic
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<void>}
 */
async function webhook(req, res) {
    try {
        const body = req.body;
        if (!body) {
            res.sendStatus(400);
            throw new Error("Body not found")
        }

        if (!body.object) {
            res.sendStatus(404);
            throw new Error("Object not found")
        }

        const headers = req.headers

        if (!headers) {
            res.sendStatus(404);
            throw new Error("Headers not found")
        }

        if (headers['content-type'] !== 'application/json') {
            res.sendStatus(404)
            throw new Error("Content Type is not of JSON")
        }

        if (req.body.object !== "page") {
            res.sendStatus(404);
            return;
        }

        res.status(200).send("EVENT_RECEIVED");

        const FBSignature = req.headers["x-hub-signature-256"];
        if (!FBSignature) {
            throw new Error("Signature not found");
        }

        // COMMENT THIS OUT FOR WHEN TESTING
        const key = process.env.APP_SECRET;
        if (!key) {
            throw new Error("Key not found");
        }

        const hash = await getHash(JSON.stringify(body), key)
        const mySignature = "sha256=" + hash;

        if (mySignature !== FBSignature) {
            throw new Error("Signatures do not match");
        }

        const PSIDs = [];
        const commands = [];
        // Load PSIDs and pageIDs to arrays in order to send replies to all users due to batching mechanism
        for (let i = 0; i < body.entry.length; i++) {
            if (!body.entry[i].messaging) {
                throw new Error("Messaging not found");
            }
            for (let j = 0; j < body.entry[i].messaging.length; j++) {
                const PSID = body.entry[i].messaging[j].sender.id;
                if (!PSID) {
                    throw new Error("PSID not found");
                }

                PSIDs.push(PSID);

                // Mutually exclusive
                let command = body.entry[i].messaging[j].message?.text;
                if (!command) {
                    command = body.entry[i].messaging[j].postback?.payload;
                }

                if (!command) {
                    throw new Error("Empty Message: Command Null")
                }
                command = command.toUpperCase();

                commands.push(command);
            }
        }
        const pageAccessToken = process.env.PAGE_TOKEN;
        if (!pageAccessToken) {
            throw new Error("Page access token not found");
        }

        for (let i = 0; i < PSIDs.length; i++) {
            // do whatever you want to do with the sent message

            await sendTextMessage("Hello World!", PSIDs[i], pageAccessToken);

            // await processCommand(commands[i], PSIDs[i], pageAccessToken) // example
        }
    } catch (error) {
        if (!res.headersSent) {
            res.sendStatus(500);
        }
        await logError(error);
    }
}

export {
    validateFBConnection,
    webhook,
}