import React, { useState } from 'react';
import { X, Send, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function MentoringRequestModal({ mentor, initialSkill, onClose, onSuccess }) {
  const [skillId, setSkillId] = useState(initialSkill?.skillId || (mentor.skills && mentor.skills[0]?.skillId) || '');
  const [message, setMessage] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillId) {
      setError('Please select a skill');
      return;
    }
    if (!preferredDateTime) {
      setError('Please provide your preferred date and time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createRequest({
        mentorId: mentor.userId,
        skillId: Number(skillId),
        message: message || `Hi ${mentor.name}, I'd love to learn from you!`,
        preferredDateTime
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eligible teach skills of the mentor
  const teachSkills = mentor.skills ? mentor.skills.filter(s => s.type === 'TEACH' || s.type === 'BOTH') : [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 className="card-title">Request Mentoring Session</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Peer Mentor: <strong>{mentor.name}</strong> ({mentor.college || 'Peer Student'})
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
            <label className="form-label">Skill you want to learn</label>
            <select 
              className="form-control" 
              value={skillId} 
              onChange={(e) => setSkillId(e.target.value)}
              required
            >
              <option value="">Select skill...</option>
              {teachSkills.map(s => (
                <option key={s.skillId} value={s.skillId}>
                  {s.skillName} ({s.proficiency})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Date & Time</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Wednesday 4:00 PM - 5:00 PM"
              value={preferredDateTime}
              onChange={(e) => setPreferredDateTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message / Learning Goals</label>
            <textarea 
              className="form-control" 
              rows={4}
              placeholder="Briefly describe what you'd like guidance with (e.g., debugging Spring Boot JPA relationships, reviewing code, understanding algorithms)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} /> {loading ? 'Submitting...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
