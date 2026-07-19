import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Viewer from './Viewer';
import Admin from './Admin';
import Login from './Login';
import SplashScreen from './components/SplashScreen';

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div style={{ color: 'white', padding: 24, textAlign: 'center' }}>Checking authentication...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(window.location.pathname === '/');

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Viewer />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
