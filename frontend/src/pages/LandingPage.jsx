import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Repeat, 
  Calendar, 
  Award, 
  Search, 
  CheckCircle2 
} from 'lucide-react';

export default function LandingPage({ setCurrentView, currentUser }) {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0e7ff', color: '#4338ca', padding: '0.35rem 0.9rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          <Sparkles size={16} /> Campus Peer-to-Peer Learning Revolution
        </div>
        <h1>
          Exchange Skills & Grow Together With <br />
          <span style={{ color: 'var(--primary)', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Micro-Mentoring
          </span>
        </h1>
        <p>
          Connect with fellow students to teach what you know and learn what you need. 
          Trade Java coding for UI design, Python for cloud computing, and build real confidence in 45-minute focused peer sessions.
        </p>

        <div className="hero-actions">
          {currentUser ? (
            <button className="btn btn-primary" onClick={() => setCurrentView('discover')}>
              Explore Campus Mentors <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => setCurrentView('register')}>
                Get Started Free <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary" onClick={() => setCurrentView('discover')}>
                <Search size={18} /> Browse Skills
              </button>
            </>
          )}
        </div>
      </section>

      {/* Metrics Banner */}
      <div className="stats-banner">
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Peer-to-Peer Micro Exchanges</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">45 Min</div>
          <div className="stat-label">Focused Micro Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">Zero $</div>
          <div className="stat-label">Free Skill Exchange For Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">4.9 / 5</div>
          <div className="stat-label">Peer Mentoring Rating</div>
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
          How SkillBridge Works
        </h2>
        <div className="grid-3">
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Users size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. List Your Skills</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Add skills you can teach and skills you want to learn. Specify your proficiency level and weekly availability.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Repeat size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Request a Mentor</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Discover classmates with the exact expertise you need. Send a tailored request with your questions and available time slot.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Calendar size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Meet & Level Up</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Meet online or in the college library. Complete your session, exchange reviews, and unlock continuous learning progress.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Popular Campus Skill Categories</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Explore what other students are teaching and mastering right now
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setCurrentView('discover')}>
            View All Skills
          </button>
        </div>

        <div className="grid-3">
          {[
            { title: 'Software Engineering', desc: 'Java, Spring Boot, Microservices, REST APIs, Git', count: '12 Mentors' },
            { title: 'Web Development', desc: 'React.js, Next.js, HTML5, CSS3, Tailwind, JavaScript', count: '15 Mentors' },
            { title: 'Data Science & AI', desc: 'Python, NumPy, Pandas, Scikit-learn, Deep Learning', count: '9 Mentors' },
            { title: 'UI/UX & Design', desc: 'Figma, Wireframing, Prototyping, Design Systems', count: '8 Mentors' },
            { title: 'Data Structures & Algo', desc: 'Arrays, Trees, Graphs, LeetCode, Dynamic Programming', count: '14 Mentors' },
            { title: 'Cloud & DevOps', desc: 'Docker, Kubernetes, AWS, CI/CD Pipelines, Linux', count: '6 Mentors' }
          ].map((cat, idx) => (
            <div key={idx} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
              <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>{cat.title}</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{cat.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-primary">{cat.count}</span>
                <button className="btn btn-outline btn-sm" onClick={() => setCurrentView('discover')}>
                  Find Mentors
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
