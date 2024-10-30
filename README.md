# Messenger Webhook Test

This is a simple project to showcase how to use the Facebook Messenger webhook to send messages to a page.

## Setup

### Server Setup

1. Clone the repository
2. Rename the `env.example` file to `.env`
3. Fill in the required environment variables from the fb subscription setup
4. Run `npm install` or `npm ci` if this becomes legacy code
5. Run `npm run dev` to start the server

### Webhook Subscription Setup

1. Log into your Facebook Developer account
2. Follow the instructions on setting up a webhook subscription
3. Get all the required variables from the webhook subscription
4. Setup webhook and verify the subscription
5. Setup `messages` and `messaging_postbacks` webhook events
6. Enjoy your bot!
