import { AppDataSource } from '../config/db.js';
import { Role } from '../entity/Role.js';

export async function getAllRoles(req, res) {
  try {
    const roleRepository = AppDataSource.getRepository(Role);
    const roles = await roleRepository.find();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}