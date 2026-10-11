import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function FeedbackModal({ session, currentUser, onClose, onSuccess }) {
  const isLearner = session.request.learner.userId === currentUser.userId;
  const targetUser = isLearner ? session.request.mentor : session.request.learner;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.submitFeedback({
        sessionId: session.sessionId,
        targetUserId: targetUser.userId,
        rating: Number(rating),
        comment: comment || 'Great peer mentoring session! Very insightful and helpful.'
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
            <h3 className="card-title">Leave Session Feedback</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Review for <strong>{targetUser.name}</strong> ({session.request.skill?.skillName})
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
          <div className="form-group" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>Select Rating</label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= rating ? '#f59e0b' : '#cbd5e1',
                    transform: star <= rating ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setRating(star)}
                >
                  <Star size={36} fill={star <= rating ? '#f59e0b' : 'none'} />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>
              {rating === 5 && 'Outstanding & extremely helpful! 🌟'}
              {rating === 4 && 'Very good session! 👍'}
              {rating === 3 && 'Decent session.'}
              {rating === 2 && 'Needs improvement.'}
              {rating === 1 && 'Did not meet expectations.'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Review Comments</label>
            <textarea 
              className="form-control" 
              rows={4}
              placeholder="Share what you learned, how helpful the peer mentor was, and any tips for other students..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <CheckCircle size={16} /> {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
