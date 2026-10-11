import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  GraduationCap 
} from 'lucide-react';
import { api } from '../services/api';
import MentoringRequestModal from '../components/MentoringRequestModal';

export default function MentorProfilePage({ mentorId, currentUser, setCurrentView }) {
  const [mentor, setMentor] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    async function fetchMentorDetails() {
      try {
        setLoading(true);
        const [profileData, feedbackData] = await Promise.all([
          api.getUserProfile(mentorId),
          api.getUserFeedbacks(mentorId)
        ]);
        setMentor(profileData);
        setFeedbacks(feedbackData || []);
      } catch (err) {
        console.error('Error fetching mentor details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (mentorId) {
      fetchMentorDetails();
    }
  }, [mentorId]);

  if (loading || !mentor) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading mentor profile...</div>;
  }

  const isSelf = currentUser && currentUser.userId === mentor.userId;
  const teachSkills = mentor.skills ? mentor.skills.filter(s => s.type === 'TEACH' || s.type === 'BOTH') : [];
  const learnSkills = mentor.skills ? mentor.skills.filter(s => s.type === 'LEARN' || s.type === 'BOTH') : [];

  return (
    <div>
      {/* Back button */}
      <button 
        className="btn btn-outline btn-sm" 
        style={{ marginBottom: '1.25rem' }} 
        onClick={() => setCurrentView('discover')}
      >
        <ArrowLeft size={16} /> Back to Discover
      </button>

      {/* Profile Header Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img 
              src={mentor.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} 
              alt={mentor.name} 
              style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '3px solid #eff6ff' }}
            />
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{mentor.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                <GraduationCap size={18} />
                <span>{mentor.college} &bull; {mentor.department} ({mentor.academicYear})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={18} fill="#f59e0b" />
                  <span>{mentor.averageRating || 5.0}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  ({mentor.reviewCount || feedbacks.length} student reviews)
                </span>
              </div>
            </div>
          </div>

          {!isSelf && currentUser && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedSkill(teachSkills[0] || null);
                setShowRequestModal(true);
              }}
            >
              <Send size={18} /> Request Mentoring Session
            </button>
          )}
        </div>

        {mentor.bio && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              ABOUT ME
            </h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.96rem', lineHeight: 1.6 }}>
              {mentor.bio}
            </p>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid-2">
        {/* Skills Offered & Wanted */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Skills can teach */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Award size={20} color="var(--primary)" /> Skills I Can Teach ({teachSkills.length})
            </h3>
            {teachSkills.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No teaching skills listed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {teachSkills.map(s => (
                  <div key={s.userSkillId} style={{ border: '1px solid var(--border)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{s.skillName}</span>
                      <span className="badge badge-primary">{s.proficiency}</span>
                    </div>
                    {s.experienceDetails && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        "{s.experienceDetails}"
                      </p>
                    )}
                    {!isSelf && currentUser && (
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ marginTop: '0.6rem', fontSize: '0.8rem' }}
                        onClick={() => {
                          setSelectedSkill(s);
                          setShowRequestModal(true);
                        }}
                      >
                        Request this skill
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills wants to learn */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BookOpen size={20} color="var(--secondary)" /> Skills I Want to Learn ({learnSkills.length})
            </h3>
            {learnSkills.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No learning skills specified.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {learnSkills.map(s => (
                  <span key={s.userSkillId} style={{ background: '#f5f3ff', color: '#6d28d9', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #ddd6fe' }}>
                    {s.skillName} ({s.proficiency})
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Availability & Feedbacks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Availability */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Clock size={20} color="var(--primary)" /> Weekly Availability
            </h3>
            {mentor.availabilities && mentor.availabilities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {mentor.availabilities.map(av => (
                  <div key={av.availabilityId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                    <strong>{av.dayOfWeek}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{av.startTime} - {av.endTime}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Availability times flexible upon request.</p>
            )}
          </div>

          {/* Peer Reviews */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MessageSquare size={20} color="var(--warning)" /> Peer Reviews ({feedbacks.length})
            </h3>
            {feedbacks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first to learn with {mentor.name}!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {feedbacks.map(f => (
                  <div key={f.feedbackId} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.reviewer?.name}</span>
                      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                        {[...Array(f.rating)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" />)}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>"{f.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showRequestModal && (
        <MentoringRequestModal 
          mentor={mentor}
          initialSkill={selectedSkill}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            alert('Request submitted! Check My Requests tab.');
            setCurrentView('requests');
          }}
        />
      )}
    </div>
  );
}
