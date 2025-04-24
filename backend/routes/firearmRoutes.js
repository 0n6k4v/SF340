import express from 'express';
import { getAllFirearms, getFirearmById, getFirearms } from '../controllers/firearmController.js';

const router = express.Router();

router.get("/firearms", getFirearms);
router.get("/firearms/:id", getFirearmById);

export default router;