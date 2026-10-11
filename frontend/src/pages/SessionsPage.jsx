import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Video, 
  MapPin, 
  CheckCircle, 
  Star, 
  Clock, 
  Users, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../services/api';
import FeedbackModal from '../components/FeedbackModal';

export default function SessionsPage({ currentUser, setCurrentView }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackSession, setFeedbackSession] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await api.getMySessions();
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleComplete = async (sessionId) => {
    try {
      await api.completeSession(sessionId);
      fetchSessions();
    } catch (err) {
      alert(err.message);
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'SCHEDULED');
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Peer Sessions & Calendar</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track upcoming micro-mentoring meetings and review completed skill exchanges
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No sessions scheduled yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Once a mentoring request is accepted and scheduled, your sessions appear here.
          </p>
          <button className="btn btn-primary" onClick={() => setCurrentView('requests')}>
            Check My Requests
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Upcoming Sessions Section */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--primary)" /> Upcoming Sessions ({upcomingSessions.length})
            </h3>

            {upcomingSessions.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No pending upcoming sessions.
              </div>
            ) : (
              <div className="grid-2">
                {upcomingSessions.map(sess => {
                  const isMentor = sess.request.mentor.userId === currentUser.userId;
                  const partner = isMentor ? sess.request.learner : sess.request.mentor;

                  return (
                    <div key={sess.sessionId} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontWeight: 800, fontSize: '1.15rem' }}>{sess.request.skill.skillName}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Role: <strong>{isMentor ? 'Teaching' : 'Learning'}</strong> with {partner.name}
                          </span>
                        </div>
                        <span className="badge badge-accepted">UPCOMING</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.75rem 0', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} color="var(--primary)" />
                          <span><strong>Time:</strong> {sess.scheduledAt} ({sess.duration} mins)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {sess.mode === 'ONLINE' ? <Video size={16} color="#7c3aed" /> : <MapPin size={16} color="#059669" />}
                          <span><strong>Mode:</strong> {sess.mode} &bull; {sess.meetingLinkOrLocation}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        {sess.mode === 'ONLINE' && sess.meetingLinkOrLocation.startsWith('http') && (
                          <a 
                            href={sess.meetingLinkOrLocation} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1 }}
                          >
                            <ExternalLink size={14} /> Join Meeting
                          </a>
                        )}
                        <button 
                          className="btn btn-success btn-sm" 
                          style={{ flex: 1 }}
                          onClick={() => handleComplete(sess.sessionId)}
                        >
                          <CheckCircle size={14} /> Mark Completed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed Sessions Section */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} color="var(--success)" /> Completed Sessions ({completedSessions.length})
            </h3>

            {completedSessions.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No completed sessions yet.
              </div>
            ) : (
              <div className="grid-2">
                {completedSessions.map(sess => {
                  const isMentor = sess.request.mentor.userId === currentUser.userId;
                  const partner = isMentor ? sess.request.learner : sess.request.mentor;

                  return (
                    <div key={sess.sessionId} className="card" style={{ background: '#fcfdfd', borderLeft: '4px solid var(--success)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{sess.request.skill.skillName}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            With: {partner.name} ({isMentor ? 'You taught' : 'You learned'})
                          </span>
                        </div>
                        <span className="badge badge-completed">COMPLETED</span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                        Session on: {sess.scheduledAt}
                      </div>

                      <div style={{ marginTop: '0.75rem' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setFeedbackSession(sess)}
                        >
                          <Star size={14} fill="#f59e0b" color="#f59e0b" /> Leave or Review Feedback
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackSession && (
        <FeedbackModal 
          session={feedbackSession}
          currentUser={currentUser}
          onClose={() => setFeedbackSession(null)}
          onSuccess={() => {
            setFeedbackSession(null);
            alert('Feedback submitted successfully!');
            fetchSessions();
          }}
        />
      )}
    </div>
  );
}
