import express from 'express';
import { getSubDistricts } from '../controllers/subdistrictController.js';

const router = express.Router();

// Fetch subdistricts by district ID or all subdistricts if no district_id is provided
router.get('/subdistricts', async (req, res) => {
    const { district_id } = req.query;

    try {
        // หากไม่มี district_id แสดงว่าต้องการดึงข้อมูลทั้งหมด
        if (!district_id) {
            const subdistricts = await getSubDistricts();
            return res.json(subdistricts);
        }

        // หากมี district_id ตรวจสอบว่าเป็นตัวเลขหรือไม่
        if (isNaN(district_id)) {
            return res.status(400).json({ error: 'Invalid District ID' });
        }

        // ดึงข้อมูลตำบลตาม district_id
        const subdistricts = await getSubDistricts(parseInt(district_id));
        if (subdistricts.length === 0) {
            return res.status(404).json({ error: 'No subdistricts found for this district' });
        }
        res.json(subdistricts);
    } catch (error) {
        console.error('Error in /subdistricts:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch subdistricts' });
    }
});

export default router;