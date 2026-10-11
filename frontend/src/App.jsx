import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverPage from './pages/DiscoverPage';
import MentorProfilePage from './pages/MentorProfilePage';
import RequestsPage from './pages/RequestsPage';
import SessionsPage from './pages/SessionsPage';
import LearningPage from './pages/LearningPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfileManagePage from './pages/ProfileManagePage';
import { authStorage, api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(authStorage.getUser());
  const [currentView, setCurrentView] = useState('landing');
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (currentUser) {
      try {
        const res = await api.getUnreadCount();
        setUnreadCount(res?.unreadCount || 0);
      } catch (err) {
        // quiet error on unread polling
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleAuthChanged = () => {
      setCurrentUser(authStorage.getUser());
    };
    window.addEventListener('auth-changed', handleAuthChanged);
    return () => window.removeEventListener('auth-changed', handleAuthChanged);
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    fetchUnreadCount();
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="app-container">
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        unreadCount={unreadCount}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {currentView === 'landing' && (
          <LandingPage 
            setCurrentView={setCurrentView}
            currentUser={currentUser}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage 
            setCurrentView={setCurrentView}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'login' && (
          <LoginPage 
            setCurrentView={setCurrentView}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardPage 
            currentUser={currentUser}
            setCurrentView={setCurrentView}
            setSelectedMentorId={setSelectedMentorId}
          />
        )}

        {currentView === 'discover' && (
          <DiscoverPage 
            currentUser={currentUser}
            setCurrentView={setCurrentView}
            setSelectedMentorId={setSelectedMentorId}
          />
        )}

        {currentView === 'mentor-profile' && (
          <MentorProfilePage 
            mentorId={selectedMentorId}
            currentUser={currentUser}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'requests' && currentUser && (
          <RequestsPage 
            currentUser={currentUser}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'sessions' && currentUser && (
          <SessionsPage 
            currentUser={currentUser}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'learning' && currentUser && (
          <LearningPage 
            currentUser={currentUser}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'notifications' && currentUser && (
          <NotificationsPage 
            currentUser={currentUser}
            onNotificationsUpdated={fetchUnreadCount}
          />
        )}

        {currentView === 'profile-manage' && currentUser && (
          <ProfileManagePage 
            currentUser={currentUser}
            onProfileUpdated={() => setCurrentUser(authStorage.getUser())}
          />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', background: '#ffffff', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <strong>SkillBridge</strong> &copy; {new Date().getFullYear()} — Campus Peer-to-Peer Micro-Mentoring Platform
          </div>
          <div>
            Spring Boot &bull; React.js &bull; MySQL &bull; Spring Security &bull; JWT
          </div>
        </div>
      </footer>
    </div>
  );
}
