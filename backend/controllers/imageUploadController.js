import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';

export const uploadImage = async (req, res) => {
  try {
    const file = req.file.path;

    const result = await cloudinary.uploader.upload(file, {
      folder: 'my_uploads',
    });

    // ลบไฟล์ชั่วคราวหลังจาก upload เรียบร้อยแล้ว
    fs.unlinkSync(file);

    res.status(200).json({
      message: 'อัปโหลดสำเร็จ',
      url: result.secure_url,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};