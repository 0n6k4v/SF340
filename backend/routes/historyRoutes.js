import express from 'express';
import multer from 'multer';
import { 
  getAllHistory, 
  getHistoryById, 
  createHistory, 
  updateHistory, 
  deleteHistory,
  getHistoryByExhibitId
} from '../controllers/historyController.js';

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Get all history records
router.get("/history", getAllHistory);

// Get a specific history record by ID
router.get("/history/:id", getHistoryById);

// Create a new history record with image upload
router.post("/history", upload.single('image'), createHistory);

// Update a history record with optional image upload
router.put("/history/:id", upload.single('image'), updateHistory);

// Delete a history record
router.delete("/history/:id", deleteHistory);

// Get history records by exhibit ID
router.get("/history/exhibit/:exhibitId", getHistoryByExhibitId);

export default router;