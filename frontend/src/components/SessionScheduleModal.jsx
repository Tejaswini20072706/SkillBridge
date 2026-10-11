import React, { useState } from 'react';
import { X, Calendar, Video, MapPin, AlertCircle, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function SessionScheduleModal({ request, onClose, onSuccess }) {
  const [scheduledAt, setScheduledAt] = useState(request.preferredDateTime || '');
  const [duration, setDuration] = useState(60);
  const [mode, setMode] = useState('ONLINE');
  const [meetingLinkOrLocation, setMeetingLinkOrLocation] = useState('https://meet.google.com/sb-micro-mentoring');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledAt) {
      setError('Please specify session date and time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.scheduleSession({
        requestId: request.requestId,
        scheduledAt,
        duration: Number(duration),
        mode,
        meetingLinkOrLocation
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 className="card-title">Schedule Mentoring Session</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Skill: <strong>{request.skill?.skillName}</strong> with {request.learner?.name}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Scheduled Date & Time</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Oct 14, 2026 at 4:30 PM"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <select 
                className="form-control" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value={30}>30 mins (Quick Review)</option>
                <option value={45}>45 mins (Micro Session)</option>
                <option value={60}>60 mins (Standard)</option>
                <option value={90}>90 mins (Deep Dive)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Session Mode</label>
              <select 
                className="form-control" 
                value={mode} 
                onChange={(e) => {
                  setMode(e.target.value);
                  if (e.target.value === 'OFFLINE') {
                    setMeetingLinkOrLocation('Campus Library - Group Discussion Room 2');
                  } else {
                    setMeetingLinkOrLocation('https://meet.google.com/sb-micro-mentoring');
                  }
                }}
              >
                <option value="ONLINE">ONLINE (Virtual Meeting)</option>
                <option value="OFFLINE">OFFLINE (Campus / In-Person)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {mode === 'ONLINE' ? 'Video Meeting Link' : 'Campus Location & Room'}
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={mode === 'ONLINE' ? 'e.g. https://meet.google.com/xyz' : 'e.g. CSE Lab 3, 2nd Floor'}
              value={meetingLinkOrLocation}
              onChange={(e) => setMeetingLinkOrLocation(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Calendar size={16} /> {loading ? 'Scheduling...' : 'Confirm & Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
