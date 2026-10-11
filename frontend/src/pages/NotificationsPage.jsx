import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Calendar, 
  Clock, 
  Star, 
  GitPullRequest 
} from 'lucide-react';
import { api } from '../services/api';

export default function NotificationsPage({ currentUser, onNotificationsUpdated }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data || []);
      if (onNotificationsUpdated) onNotificationsUpdated();
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markAsRead(id);
      fetchNotifs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllAsRead();
      fetchNotifs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Notifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time updates regarding requests, sessions, and peer reviews
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Bell size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No notifications yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            When students send or accept requests, notifications will arrive here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <div 
              key={n.notificationId} 
              className="card" 
              style={{ 
                padding: '1.15rem', 
                background: n.isRead ? '#ffffff' : '#f0f7ff',
                borderLeft: n.isRead ? '1px solid var(--border)' : '4px solid var(--primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {n.title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
                  {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {!n.isRead && (
                <button 
                  className="btn btn-outline btn-sm"
                  title="Mark as read"
                  onClick={() => handleMarkRead(n.notificationId)}
                >
                  <Check size={14} /> Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
