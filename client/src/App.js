import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Main from './components/Main';
import './App.scss';

const App = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfile] = useState(null);

  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  useEffect(() => {
    console.log('Profile data updated:', profileData);
  }, [profileData]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register setUserData={setUser} setProfileData={setProfile} />} />
        <Route path="/login" element={<Login setUserData={setUser} />} />
        <Route path="/" element={<Main user={user} profileData={profileData} />} />
      </Routes>
    </Router>
  );
};

export default App;
