import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  GitPullRequest, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Video, 
  MapPin, 
  BookOpen, 
  Search, 
  PlusCircle, 
  MessageSquare 
} from 'lucide-react';
import { api } from '../services/api';
import SessionScheduleModal from '../components/SessionScheduleModal';
import FeedbackModal from '../components/FeedbackModal';

export default function DashboardPage({ currentUser, setCurrentView, setSelectedMentorId }) {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModalReq, setScheduleModalReq] = useState(null);
  const [feedbackModalSession, setFeedbackModalSession] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, r, s] = await Promise.all([
        api.getUserProfile(currentUser.userId),
        api.getMyRequests(),
        api.getMySessions()
      ]);
      setProfile(p);
      setRequests(r || []);
      setSessions(s || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser.userId]);

  const handleAcceptRequest = async (id) => {
    try {
      await api.acceptRequest(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await api.rejectRequest(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await api.completeSession(sessionId);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && !profile) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading student dashboard...</div>;
  }

  const teachingCount = profile?.skills?.filter(s => s.type === 'TEACH' || s.type === 'BOTH').length || 0;
  const learningCount = profile?.skills?.filter(s => s.type === 'LEARN' || s.type === 'BOTH').length || 0;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const upcomingSessions = sessions.filter(s => s.status === 'SCHEDULED');

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {profile?.college} &bull; {profile?.department} ({profile?.academicYear})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setCurrentView('profile-manage')}>
            <PlusCircle size={16} /> Manage Skills
          </button>
          <button className="btn btn-primary" onClick={() => setCurrentView('discover')}>
            <Search size={16} /> Discover Mentors
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-banner">
        <div className="stat-card">
          <div className="stat-number">{teachingCount}</div>
          <div className="stat-label">Skills Teaching</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{learningCount}</div>
          <div className="stat-label">Skills Learning</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pendingRequests}</div>
          <div className="stat-label">Pending Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            <Star size={24} fill="#f59e0b" color="#f59e0b" /> {profile?.averageRating || 5.0}
          </div>
          <div className="stat-label">{profile?.reviewCount || 0} Peer Reviews</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid-2">
        {/* Upcoming Sessions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary)" /> Upcoming Sessions ({upcomingSessions.length})
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => setCurrentView('sessions')}>
              View All
            </button>
          </div>

          {upcomingSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <p>No upcoming sessions scheduled.</p>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '0.75rem' }}
                onClick={() => setCurrentView('discover')}
              >
                Find a mentor to get started
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingSessions.slice(0, 3).map((sess) => {
                const isMentor = sess.request.mentor.userId === currentUser.userId;
                const partnerName = isMentor ? sess.request.learner.name : sess.request.mentor.name;

                return (
                  <div key={sess.sessionId} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{sess.request.skill.skillName}</h4>
                      <span className="badge badge-accepted">SCHEDULED</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div>With: <strong>{partnerName}</strong> ({isMentor ? 'Learner' : 'Mentor'})</div>
                      <div>Time: <strong>{sess.scheduledAt}</strong> ({sess.duration} mins)</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {sess.mode === 'ONLINE' ? <Video size={14} /> : <MapPin size={14} />}
                        {sess.mode}: {sess.meetingLinkOrLocation}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {sess.mode === 'ONLINE' && sess.meetingLinkOrLocation.startsWith('http') && (
                        <a 
                          href={sess.meetingLinkOrLocation} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-primary btn-sm"
                        >
                          Join Link
                        </a>
                      )}
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleCompleteSession(sess.sessionId)}
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

        {/* Mentoring Requests Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitPullRequest size={20} color="var(--primary)" /> Mentoring Requests
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => setCurrentView('requests')}>
              Manage All
            </button>
          </div>

          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <p>No active mentoring requests.</p>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '0.75rem' }}
                onClick={() => setCurrentView('discover')}
              >
                Request a skill exchange
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.slice(0, 3).map((req) => {
                const isMentor = req.mentor.userId === currentUser.userId;
                return (
                  <div key={req.requestId} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.98rem' }}>{req.skill.skillName}</h4>
                      <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      {isMentor ? `Requested by ${req.learner.name}` : `Sent to ${req.mentor.name}`} &bull; Slot: {req.preferredDateTime}
                    </p>

                    {req.message && (
                      <p style={{ fontSize: '0.82rem', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', fontStyle: 'italic', marginBottom: '0.6rem' }}>
                        "{req.message}"
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {isMentor && req.status === 'PENDING' && (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => handleAcceptRequest(req.requestId)}>
                            Accept
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleRejectRequest(req.requestId)}>
                            Reject
                          </button>
                        </>
                      )}

                      {req.status === 'ACCEPTED' && !sessions.some(s => s.request.requestId === req.requestId) && (
                        <button className="btn btn-primary btn-sm" onClick={() => setScheduleModalReq(req)}>
                          <Calendar size={14} /> Schedule Meeting
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {scheduleModalReq && (
        <SessionScheduleModal 
          request={scheduleModalReq}
          onClose={() => setScheduleModalReq(null)}
          onSuccess={() => {
            setScheduleModalReq(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
