import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Home from "./pages/Home";
import CameraPage from './components/Camera/Camera';
import ImagePreview from './components/Camera/ImagePreview';

const App = () => {
  return (
    <Routes>
      {/* Layout */}
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
      </Route>

      {/* None Layout */}
      <Route path='/camera' element={<CameraPage />} />
      <Route path='/imagePreview' element={<ImagePreview />}/>
    </Routes>
  );
};

export default App;