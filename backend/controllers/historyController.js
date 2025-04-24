import { AppDataSource } from '../config/db.js';
import { client } from '../config/db.js'; // Add this for PostgreSQL client
import History from '../entity/History.js';
import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });

// Helper function to get location names by IDs
async function getLocationNames(provinceId, districtId, subdistrictId) {
  const locationInfo = {
    province_name: null,
    district_name: null,
    subdistrict_name: null
  };

  try {
    // Check if client is connected
    if (!client._connected) {
      console.error('PostgreSQL client is not connected');
      return locationInfo;
    }

    // Get province name if provinceId exists
    if (provinceId) {
      const provinceResult = await client.query(
        'SELECT province_name FROM provinces WHERE id = $1',
        [provinceId]
      );
      if (provinceResult.rows.length > 0) {
        locationInfo.province_name = provinceResult.rows[0].province_name;
      }
    }

    // Get district name if districtId exists
    if (districtId) {
      const districtResult = await client.query(
        'SELECT district_name FROM districts WHERE id = $1',
        [districtId]
      );
      if (districtResult.rows.length > 0) {
        locationInfo.district_name = districtResult.rows[0].district_name;
      }
    }

    // Get subdistrict name if subdistrictId exists
    if (subdistrictId) {
      const subdistrictResult = await client.query(
        'SELECT subdistrict_name FROM subdistricts WHERE id = $1',
        [subdistrictId]
      );
      if (subdistrictResult.rows.length > 0) {
        locationInfo.subdistrict_name = subdistrictResult.rows[0].subdistrict_name;
      }
    }

    return locationInfo;
  } catch (error) {
    console.error('Error fetching location names:', error);
    return locationInfo;
  }
}

// Get all history records with exhibit data and location names
export async function getAllHistory(req, res) {
  try {
    const historyRepo = AppDataSource.getRepository(History);
    const histories = await historyRepo.find({
      relations: [
        'exhibit',
        'exhibit.firearm',
        'exhibit.images'
      ],
      order: {
        date: 'DESC',
        time: 'DESC'
      }
    });

    // Enhance each history with location names
    const enhancedHistories = await Promise.all(
      histories.map(async (history) => {
        const locationNames = await getLocationNames(
          history.province_id,
          history.district_id,
          history.subdistrict_id
        );
        
        return {
          ...history,
          ...locationNames
        };
      })
    );

    res.json(enhancedHistories);
  } catch (err) {
    console.error('Error fetching history records:', err);
    res.status(500).json({ error: err.message });
  }
}

// Get a specific history record by ID with exhibit data and location names
export async function getHistoryById(req, res) {
  try {
    const historyRepo = AppDataSource.getRepository(History);
    const history = await historyRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: [
        'exhibit',
        'exhibit.firearm',
        'exhibit.images'
      ]
    });
    
    if (!history) {
      return res.status(404).json({ error: "History record not found" });
    }
    
    // Enhance history with location names
    const locationNames = await getLocationNames(
      history.province_id,
      history.district_id,
      history.subdistrict_id
    );
    
    const enhancedHistory = {
      ...history,
      ...locationNames
    };
    
    res.json(enhancedHistory);
  } catch (err) {
    console.error('Error fetching history record:', err);
    res.status(500).json({ error: err.message });
  }
}

// Create a new history record with image upload and return with location names
export async function createHistory(req, res) {
  try {
    const historyRepo = AppDataSource.getRepository(History);
    
    // Create history data object from request body
    const historyData = {
      exhibit_id: req.body.exhibit_id || null,
      province_id: req.body.province_id || null,
      district_id: req.body.district_id || null,
      subdistrict_id: req.body.subdistrict_id || null,
      house_no: req.body.house_no || '',
      village_no: req.body.village_no || '',
      alley: req.body.alley || '',
      road: req.body.road || '',
      place_name: req.body.place_name || '',
      date: req.body.date || new Date().toISOString().split('T')[0],
      time: req.body.time || new Date().toTimeString().substring(0, 5),
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null,
      confidence_percentage: req.body.confidence_percentage || 0,
      image_url: null // Default to null, will update if image upload succeeds
    };

    // Handle image upload if present
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'evidence_history',
        });

        // Delete temporary file
        fs.unlinkSync(req.file.path);
        
        // Add image URL to history data
        historyData.image_url = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue with creation even if upload fails
      }
    }

    // Create and save history record
    const newHistory = historyRepo.create(historyData);
    await historyRepo.save(newHistory);
    
    // Fetch the created history with related exhibit data
    const createdHistory = await historyRepo.findOne({
      where: { id: newHistory.id },
      relations: [
        'exhibit',
        'exhibit.firearm',
        'exhibit.images'
      ]
    });
    
    // Enhance with location names
    if (createdHistory) {
      const locationNames = await getLocationNames(
        createdHistory.province_id,
        createdHistory.district_id,
        createdHistory.subdistrict_id
      );

      Object.assign(createdHistory, locationNames);
    }
    
    res.status(201).json(createdHistory);
  } catch (err) {
    console.error('Create history error:', err);
    res.status(500).json({ error: err.message });
  }
}

// Update a history record and return with location names
export async function updateHistory(req, res) {
  try {
    const historyRepo = AppDataSource.getRepository(History);
    const history = await historyRepo.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!history) {
      return res.status(404).json({ error: "History record not found" });
    }
    
    // Handle image upload if present
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'evidence_history',
        });

        // Delete temporary file
        fs.unlinkSync(req.file.path);
        
        // Add image URL to request body
        req.body.image_url = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue with update even if upload fails
      }
    }
    
    historyRepo.merge(history, req.body);
    const results = await historyRepo.save(history);
    
    // Fetch the updated history with related exhibit data
    const updatedHistory = await historyRepo.findOne({
      where: { id: history.id },
      relations: [
        'exhibit', 
        'exhibit.firearm',
        'exhibit.images'
      ]
    });
    
    // Enhance with location names
    if (updatedHistory) {
      const locationNames = await getLocationNames(
        updatedHistory.province_id,
        updatedHistory.district_id,
        updatedHistory.subdistrict_id
      );

      Object.assign(updatedHistory, locationNames);
    }
    
    res.json(updatedHistory);
  } catch (err) {
    console.error('Update history error:', err);
    res.status(500).json({ error: err.message });
  }
}

// Delete a history record
export async function deleteHistory(req, res) {
  try {
    const historyRepo = AppDataSource.getRepository(History);
    const history = await historyRepo.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!history) {
      return res.status(404).json({ error: "History record not found" });
    }
    
    await historyRepo.remove(history);
    res.status(200).json({ message: "History record deleted successfully" });
  } catch (err) {
    console.error('Delete history error:', err);
    res.status(500).json({ error: err.message });
  }
}

// Get history records by exhibit ID with location names
export async function getHistoryByExhibitId(req, res) {
  try {
    const historyRepo = AppDataSource.getRepository(History);
    const histories = await historyRepo.find({
      where: { exhibit_id: parseInt(req.params.exhibitId) },
      relations: [
        'exhibit',
        'exhibit.firearm',
        'exhibit.images'
      ],
      order: {
        date: 'DESC',
        time: 'DESC'
      }
    });
    
    if (histories.length === 0) {
      return res.status(404).json({ error: "No history records found for this exhibit" });
    }
    
    // Enhance each history with location names
    const enhancedHistories = await Promise.all(
      histories.map(async (history) => {
        const locationNames = await getLocationNames(
          history.province_id,
          history.district_id,
          history.subdistrict_id
        );
        
        return {
          ...history,
          ...locationNames
        };
      })
    );
    
    res.json(enhancedHistories);
  } catch (err) {
    console.error('Error fetching history by exhibit:', err);
    res.status(500).json({ error: err.message });
  }
}