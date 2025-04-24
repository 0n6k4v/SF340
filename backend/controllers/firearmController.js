import { AppDataSource } from '../config/db.js';
import Firearm from '../entity/Firearm.js';

export async function getAllFirearms(req, res) {
  try {
    const firearmRepo = AppDataSource.getRepository(Firearm);
    const firearms = await firearmRepo.find({
      relations: ["exhibit", "exhibit.images"],
    });
    res.json(firearms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getFirearms(req, res) {
  try {
    const firearmRepo = AppDataSource.getRepository(Firearm);
    let firearms;

    if (req.query.normalized_name) {
      firearms = await firearmRepo.find({
        where: { normalized_name: req.query.normalized_name },
        relations: ["exhibit", "exhibit.images"],
      });
    } else if (req.query.model) {
      firearms = await firearmRepo.find({
        where: { model: req.query.model },
        relations: ["exhibit", "exhibit.images"],
      });
    } else {
      firearms = await firearmRepo.find({
        relations: ["exhibit", "exhibit.images"],
      });
    }
    res.json(firearms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getFirearmById(req, res) {
  try {
    const firearmRepo = AppDataSource.getRepository(Firearm);
    const firearm = await firearmRepo.findOne({
      where: { exhibit_id: Number(req.params.id) },
      relations: ["exhibit", "exhibit.images"],
    });
    if (!firearm) return res.status(404).json({ error: "Not found" });
    res.json(firearm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}