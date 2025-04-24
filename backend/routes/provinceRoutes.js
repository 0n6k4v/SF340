import express from 'express';
import { getProvinces } from '../controllers/provinceController.js';

const router = express.Router();

// Fetch all provinces
router.get('/provinces', async (req, res) => {
    try {
        const provinces = await getProvinces();
        res.json(provinces);
    } catch (error) {
        console.error('Error in /provinces:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch provinces' });
    }
});

export default router;