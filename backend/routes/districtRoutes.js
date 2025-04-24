import express from 'express';
import { getDistricts } from '../controllers/districtController.js';

const router = express.Router();

// Fetch districts by province ID or all districts if no province_id is provided
router.get('/districts', async (req, res) => {
    const { province_id } = req.query;

    try {
        // หากไม่มี province_id แสดงว่าต้องการดึงข้อมูลทั้งหมด
        if (!province_id) {
            const districts = await getDistricts();
            return res.json(districts);
        }

        // หากมี province_id ตรวจสอบว่าเป็นตัวเลขหรือไม่
        if (isNaN(province_id)) {
            return res.status(400).json({ error: 'Invalid Province ID' });
        }

        // ดึงข้อมูลอำเภอตาม province_id
        const districts = await getDistricts(parseInt(province_id));
        if (districts.length === 0) {
            return res.status(404).json({ error: 'No districts found for this province' });
        }
        res.json(districts);
    } catch (error) {
        console.error('Error in /districts:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch districts' });
    }
});

export default router;