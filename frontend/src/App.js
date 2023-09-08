import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import BookingsPage from './pages/BookingsPage';

import MainNavigation from './components/Navigation/MainNavigation';
import authContext from './context/auth-context';

import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem("Authorization") || null);
  const [userID, setUserID] = useState(null);

  const login = (token, tokenExpiration, userID) => {
    setToken(token);
    setUserID(userID);
    localStorage.setItem("Authorization", token);
  }

  const logout = (token, tokenExpiration, userID) => {
    setToken(null);
    setUserID(null);
    localStorage.removeItem('Authorization');
  }

  return (
    <div>
      <BrowserRouter>
        <>
          <authContext.Provider value={{ token, userID, login, logout }}>
            <MainNavigation />
            <main className='main-content'>
              <Routes>
                {token && <Route path="/" element={<Navigate to="/events" />} />}
                {token && <Route path="/auth" element={<Navigate to="/events" />} />}
                {!token && <Route path="/auth" element={<AuthPage />} />}
                <Route path="/events" element={<EventsPage />} />

                {token && <Route path="/bookings" element={<BookingsPage />} />}
                {!token && <Route path="/bookings" element={<Navigate to="/auth" />} />}
              </Routes>
            </main>
          </authContext.Provider>
        </>
      </BrowserRouter>
    </div>
  );
}

export default App;
