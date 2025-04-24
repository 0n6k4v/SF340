import { client } from '../config/db.js';

export async function getProvinces() {
    if (!client._connected) {
        console.error('Database is not connected');
        return [];
    }
    try {
        const res = await client.query(`
            SELECT id, province_name, ST_AsGeoJSON(geom) AS geometry
            FROM provinces
        `);
        return res.rows.map(row => ({
            id: row.id,
            province_name: row.province_name,
            geometry: JSON.parse(row.geometry)
        }));
    } catch (error) {
        console.error('Error fetching provinces:', error.message, error.stack);
        return [];
    }
}