import express from 'express';
import { validateFBConnection, webhook } from '../controllers/bot.js';

const router = express.Router();

router.get('/webhook', validateFBConnection); 
router.post('/webhook', webhook);

export default router;