import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Layout3 from './components/Layout3';
import Login from './pages/Login';
import Home from "./pages/Home";
import CameraPage from './components/Camera/Camera';
import ImagePreview from './components/Camera/ImagePreview';
import EvidenceProfile from './pages/EvidenceProfile';

const App = () => {
  return (
    <Routes>
      {/* None Layout */}
      <Route path='/login' element={<Login />} />
      <Route path='/camera' element={<CameraPage />} />
      <Route path='/imagePreview' element={<ImagePreview />}/>

      {/* Layout */}
      <Route element={<Layout />}>
        <Route path='/home' element={<Home />} />
      </Route>
      
      {/* Layout 3 */}
      <Route element={<Layout3 />}>
        {/* Evidence Profile */}
        <Route path='/evidenceProfile' element={<EvidenceProfile />} />
      </Route>
    </Routes>
  );
};

export default App;