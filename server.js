import express from 'express';
import router from './routes/routes';
require('dotenv').config()

const app = express();

app.use(express.json());

app.use(router);

const PORT = process.env.PORT;
if (!PORT) {
    throw new Error('PORT is not set'); 
}

app.listen(PORT, () => {
    console.log(`Application is running on http://localhost:${PORT}`);
});