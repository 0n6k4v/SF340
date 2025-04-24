import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import { connectToDatabase } from './config/db.js';
import provinceRoutes from './routes/provinceRoutes.js';
import districtRoutes from './routes/districtRoutes.js';
import subdistrictRoutes from './routes/subdistrictRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import firearmRoutes from './routes/firearmRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import imageUploadRoutes from './routes/imageUploadRoutes.js';

import connectCloudinary from './config/cloudinary.js'
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api', provinceRoutes);
app.use('/api', districtRoutes);
app.use('/api', subdistrictRoutes);
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', firearmRoutes);
app.use('/api', historyRoutes);
app.use('/api', imageUploadRoutes);  

app.use((err, req, res, next) => {
  console.error('Error:', err.message, err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;

connectToDatabase()
connectCloudinary()  
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Failed to start server:', error.message, error.stack);
  process.exit(1);
});