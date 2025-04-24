import { client } from '../config/db.js';

export async function getDistricts(provinceId = null) {
    if (!client._connected) {
        console.error('Database is not connected');
        return [];
    }
    try {
        let query, queryParams;

        // หากไม่มี provinceId แสดงว่าต้องการดึงข้อมูลทั้งหมด
        if (!provinceId) {
            query = `
                SELECT id, province_id, district_name, ST_AsGeoJSON(geom) AS geometry
                FROM districts
            `;
            queryParams = [];
        } else {
            // หากมี provinceId แสดงว่าต้องการดึงข้อมูลเฉพาะบางรายการ
            query = `
                SELECT id, province_id, district_name, ST_AsGeoJSON(geom) AS geometry
                FROM districts
                WHERE province_id = $1
            `;
            queryParams = [provinceId];
        }

        const res = await client.query(query, queryParams);
        return res.rows.map(row => ({
            id: row.id,
            province_id: row.province_id,
            district_name: row.district_name,
            geometry: JSON.parse(row.geometry)
        }));
    } catch (error) {
        console.error('Error fetching districts:', error.message, error.stack);
        return [];
    }
}