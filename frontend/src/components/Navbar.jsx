import React from 'react';
import { 
  BookOpen, 
  Search, 
  LayoutDashboard, 
  GitPullRequest, 
  Calendar, 
  Award, 
  Bell, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus 
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, currentUser, unreadCount, onLogout }) {
  return (
    <nav className="navbar">
      <div className="brand" onClick={() => setCurrentView('landing')}>
        <BookOpen size={28} />
        <span>SkillBridge</span>
      </div>

      <div className="nav-links">
        {currentUser ? (
          <>
            <button 
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              className={`nav-link ${currentView === 'discover' ? 'active' : ''}`}
              onClick={() => setCurrentView('discover')}
            >
              <Search size={18} /> Discover Skills
            </button>
            <button 
              className={`nav-link ${currentView === 'requests' ? 'active' : ''}`}
              onClick={() => setCurrentView('requests')}
            >
              <GitPullRequest size={18} /> My Requests
            </button>
            <button 
              className={`nav-link ${currentView === 'sessions' ? 'active' : ''}`}
              onClick={() => setCurrentView('sessions')}
            >
              <Calendar size={18} /> Sessions & Calendar
            </button>
            <button 
              className={`nav-link ${currentView === 'learning' ? 'active' : ''}`}
              onClick={() => setCurrentView('learning')}
            >
              <Award size={18} /> My Learning
            </button>
          </>
        ) : (
          <>
            <button 
              className={`nav-link ${currentView === 'discover' ? 'active' : ''}`}
              onClick={() => setCurrentView('discover')}
            >
              <Search size={18} /> Browse Skills
            </button>
          </>
        )}
      </div>

      <div className="nav-user">
        {currentUser ? (
          <>
            <button 
              className="notif-btn" 
              title="Notifications"
              onClick={() => setCurrentView('notifications')}
            >
              <Bell size={22} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            <div 
              className="user-badge" 
              onClick={() => setCurrentView('profile-manage')}
              title="View & Edit Profile"
            >
              <img 
                src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} 
                alt={currentUser.name} 
                className="user-avatar"
              />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser.name.split(' ')[0]}</span>
            </div>

            <button 
              className="btn btn-outline btn-sm" 
              onClick={onLogout} 
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setCurrentView('login')}
            >
              <LogIn size={16} /> Login
            </button>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => setCurrentView('register')}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
