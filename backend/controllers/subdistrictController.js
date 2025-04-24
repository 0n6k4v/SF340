import { client } from '../config/db.js';

export async function getSubDistricts(districtId = null) {
    if (!client._connected) {
        console.error('Database is not connected');
        return [];
    }
    try {
        let query, queryParams;

        // หากไม่มี districtId แสดงว่าต้องการดึงข้อมูลทั้งหมด
        if (!districtId) {
            query = `
                SELECT id, district_id, subdistrict_name, ST_AsGeoJSON(geom) AS geometry
                FROM subdistricts
            `;
            queryParams = [];
        } else {
            // หากมี districtId แสดงว่าต้องการดึงข้อมูลเฉพาะบางรายการ
            query = `
                SELECT id, district_id, subdistrict_name, ST_AsGeoJSON(geom) AS geometry
                FROM subdistricts
                WHERE district_id = $1
            `;
            queryParams = [districtId];
        }

        const res = await client.query(query, queryParams);
        return res.rows.map(row => ({
            id: row.id,
            district_id: row.district_id,
            subdistrict_name: row.subdistrict_name,
            geometry: JSON.parse(row.geometry)
        }));
    } catch (error) {
        console.error('Error fetching subdistricts:', error.message, error.stack);
        return [];
    }
}