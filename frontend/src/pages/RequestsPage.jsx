import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  MessageSquare, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import SessionScheduleModal from '../components/SessionScheduleModal';

export default function RequestsPage({ currentUser, setCurrentView }) {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [loading, setLoading] = useState(true);
  const [scheduleModalReq, setScheduleModalReq] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getMyRequests();
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.acceptRequest(id);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectRequest(id);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await api.cancelRequest(id);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const receivedRequests = requests.filter(r => r.mentor.userId === currentUser.userId);
  const sentRequests = requests.filter(r => r.learner.userId === currentUser.userId);
  const displayedRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Mentoring Requests</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Review learning requests, accept invites, and schedule micro-mentoring sessions
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', background: '#e2e8f0', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button 
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'received' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'received' ? 'var(--primary)' : 'var(--text-muted)'
            }}
            onClick={() => setActiveTab('received')}
          >
            Received as Mentor ({receivedRequests.length})
          </button>
          <button 
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'sent' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'sent' ? 'var(--primary)' : 'var(--text-muted)'
            }}
            onClick={() => setActiveTab('sent')}
          >
            Sent as Learner ({sentRequests.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading requests...</div>
      ) : displayedRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <GitPullRequest size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No {activeTab} mentoring requests</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {activeTab === 'received' 
              ? 'When students request you to mentor them in your listed skills, they will show up here.' 
              : 'You have not submitted any mentoring requests yet.'}
          </p>
          {activeTab === 'sent' && (
            <button className="btn btn-primary" onClick={() => setCurrentView('discover')}>
              Explore Mentors & Send Request
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedRequests.map(req => {
            const isMentor = req.mentor.userId === currentUser.userId;
            const otherUser = isMentor ? req.learner : req.mentor;

            return (
              <div key={req.requestId} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={otherUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}`} 
                      alt={otherUser.name} 
                      className="user-avatar"
                      style={{ width: 44, height: 44 }}
                    />
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {isMentor ? `Request from ${otherUser.name}` : `Mentoring with ${otherUser.name}`}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Skill: <strong style={{ color: 'var(--primary)' }}>{req.skill.skillName}</strong> &bull; {otherUser.college || 'Peer Student'}
                      </div>
                    </div>
                  </div>

                  <span className={`badge badge-${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <Clock size={16} /> <strong>Preferred Slot:</strong> {req.preferredDateTime}
                  </div>
                  {req.message && (
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic', marginTop: '0.4rem' }}>
                      "{req.message}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {isMentor && req.status === 'PENDING' && (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleReject(req.requestId)}>
                        <XCircle size={15} /> Decline
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAccept(req.requestId)}>
                        <CheckCircle size={15} /> Accept Request
                      </button>
                    </>
                  )}

                  {!isMentor && req.status === 'PENDING' && (
                    <button className="btn btn-outline btn-sm" onClick={() => handleCancel(req.requestId)}>
                      Cancel Request
                    </button>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <button className="btn btn-primary btn-sm" onClick={() => setScheduleModalReq(req)}>
                      <Calendar size={15} /> Schedule Session Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModalReq && (
        <SessionScheduleModal 
          request={scheduleModalReq}
          onClose={() => setScheduleModalReq(null)}
          onSuccess={() => {
            setScheduleModalReq(null);
            fetchRequests();
            setCurrentView('sessions');
          }}
        />
      )}
    </div>
  );
}
