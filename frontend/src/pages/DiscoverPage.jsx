import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  BookOpen, 
  Plus, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  UserCheck 
} from 'lucide-react';
import { api } from '../services/api';
import MentoringRequestModal from '../components/MentoringRequestModal';

export default function DiscoverPage({ currentUser, setCurrentView, setSelectedMentorId }) {
  const [mentors, setMentors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProficiency, setSelectedProficiency] = useState('All');
  const [loading, setLoading] = useState(true);

  // Mentoring Request Modal state
  const [requestTarget, setRequestTarget] = useState(null);

  // Add Skill Modal
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Software Engineering');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  const loadMentorsAndSkills = async () => {
    try {
      setLoading(true);
      const [skillsData, mentorsData] = await Promise.all([
        api.getSkills(),
        api.searchMentors({
          query: searchQuery,
          category: selectedCategory,
          proficiency: selectedProficiency
        })
      ]);
      setSkills(skillsData || []);
      setMentors(mentorsData || []);
    } catch (err) {
      console.error('Error fetching mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentorsAndSkills();
  }, [searchQuery, selectedCategory, selectedProficiency]);

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    try {
      await api.createSkill({
        skillName: newSkillName,
        category: newSkillCat,
        description: newSkillDesc
      });
      setShowAddSkillModal(false);
      setNewSkillName('');
      setNewSkillDesc('');
      loadMentorsAndSkills();
    } catch (err) {
      alert(err.message);
    }
  };

  const categories = ['All', 'Software Engineering', 'Web Development', 'Data Science', 'Design', 'Computer Science', 'DevOps & Cloud'];
  const proficiencies = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  return (
    <div>
      {/* Search Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Discover Skills & Peer Mentors</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Find classmates willing to micro-mentor you in specific technical skills
            </p>
          </div>
          {currentUser && (
            <button className="btn btn-primary" onClick={() => setShowAddSkillModal(true)}>
              <Plus size={16} /> Propose New Skill
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="grid-3" style={{ alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search by Skill Name or Mentor</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Java, React, Figma, Python..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Skill Category</label>
              <select 
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Proficiency Level</label>
              <select 
                className="form-control"
                value={selectedProficiency}
                onChange={(e) => setSelectedProficiency(e.target.value)}
              >
                {proficiencies.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Searching available peer mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No mentors matching your criteria found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Try broadening your search keywords or clear your category filter.
          </p>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedProficiency('All'); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {mentors.map((item) => {
            const mentor = item.user;
            const skill = item.skill;
            const isSelf = currentUser && currentUser.userId === mentor.userId;

            return (
              <div key={item.userSkillId} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Top user row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <img 
                      src={mentor.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} 
                      alt={mentor.name} 
                      className="user-avatar"
                      style={{ width: 48, height: 48 }}
                    />
                    <div>
                      <h4 
                        style={{ fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', color: 'var(--text-main)' }}
                        onClick={() => {
                          setSelectedMentorId(mentor.userId);
                          setCurrentView('mentor-profile');
                        }}
                      >
                        {mentor.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {mentor.college || 'Peer Student'} &bull; {mentor.academicYear || ''}
                      </div>
                    </div>
                  </div>

                  {/* Skill Badge & Proficiency */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                        {skill.skillName}
                      </span>
                      <span className="badge badge-primary">{item.proficiency}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Category: {skill.category}
                    </div>
                  </div>

                  {/* Experience notes */}
                  {item.experienceDetails && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontStyle: 'italic' }}>
                      "{item.experienceDetails}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-outline btn-sm" 
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSelectedMentorId(mentor.userId);
                      setCurrentView('mentor-profile');
                    }}
                  >
                    View Profile
                  </button>

                  {currentUser && !isSelf && (
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => setRequestTarget({ mentor, skill })}
                    >
                      Request Help
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mentoring Request Modal */}
      {requestTarget && (
        <MentoringRequestModal 
          mentor={requestTarget.mentor}
          initialSkill={requestTarget.skill}
          onClose={() => setRequestTarget(null)}
          onSuccess={() => {
            setRequestTarget(null);
            alert('Mentoring request sent successfully! You can track it under My Requests.');
            setCurrentView('requests');
          }}
        />
      )}

      {/* Propose New Skill Modal */}
      {showAddSkillModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="card-title">Propose a New Campus Skill</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddSkillModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateSkill}>
              <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Next.js App Router, GraphQL, Tailwind CSS"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-control"
                  value={newSkillCat}
                  onChange={(e) => setNewSkillCat(e.target.value)}
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Topics Covered</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  placeholder="Brief overview of concepts covered in this skill"
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSkillModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
