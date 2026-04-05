import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            // Give a soft success if they're already subscribed
            if (existingSubscriber.isActive) {
                return res.status(200).json({ message: 'You are already subscribed!' });
            }
            
            // Re-activate if they were inactive
            existingSubscriber.isActive = true;
            await existingSubscriber.save();
            return res.status(200).json({ message: 'Subscription successfully reactivated!' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ message: 'Successfully subscribed to the daily tech pulse!' });
    } catch (err) {
        console.error('Newsletter subscribe error:', err.message);
        res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
    }
});

export default router;
