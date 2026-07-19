import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Viewer from './Viewer';
import Admin from './Admin';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Viewer />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}
