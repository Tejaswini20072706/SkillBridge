import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Users, 
  Repeat, 
  ArrowRight, 
  Star 
} from 'lucide-react';
import { api } from '../services/api';

export default function LearningPage({ currentUser, setCurrentView }) {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [p, s] = await Promise.all([
          api.getUserProfile(currentUser.userId),
          api.getMySessions()
        ]);
        setProfile(p);
        setSessions(s || []);
      } catch (err) {
        console.error('Learning data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser.userId]);

  if (loading || !profile) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading peer learning activity...</div>;
  }

  const taughtSessions = sessions.filter(s => s.status === 'COMPLETED' && s.request.mentor.userId === currentUser.userId);
  const learnedSessions = sessions.filter(s => s.status === 'COMPLETED' && s.request.learner.userId === currentUser.userId);

  const teachingSkills = profile.skills.filter(s => s.type === 'TEACH' || s.type === 'BOTH');
  const learningSkills = profile.skills.filter(s => s.type === 'LEARN' || s.type === 'BOTH');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>My Learning & Skill Exchange</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Record of knowledge exchanged, peer micro-mentoring hours, and skills mastered
        </p>
      </div>

      {/* Exchange Summary Pill */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Repeat size={24} /> Peer Knowledge Equilibrium
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              SkillBridge empowers reciprocal student growth. Teach a skill, earn campus credits to learn a skill.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{taughtSessions.length}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sessions Taught</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)' }}></div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed' }}>{learnedSessions.length}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sessions Learned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* What I Am Learning */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="#7c3aed" /> What I Am Learning ({learningSkills.length})
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('discover')}>
              Find Mentor
            </button>
          </div>

          {learningSkills.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't added skills to learn yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {learningSkills.map(s => (
                <div key={s.userSkillId} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{s.skillName}</h4>
                    <span className="badge badge-primary">{s.proficiency}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Category: {s.category}
                  </div>
                  <button 
                    className="btn btn-outline btn-sm" 
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => setCurrentView('discover')}
                  >
                    Find Peer Mentors in {s.skillName} <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* What I Am Teaching */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--primary)" /> What I Am Teaching ({teachingSkills.length})
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentView('profile-manage')}>
              Edit Skills
            </button>
          </div>

          {teachingSkills.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't listed any skills to teach yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {teachingSkills.map(s => (
                <div key={s.userSkillId} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{s.skillName}</h4>
                    <span className="badge badge-accepted">{s.proficiency}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Category: {s.category}
                  </div>
                  {s.experienceDetails && (
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                      "{s.experienceDetails}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
