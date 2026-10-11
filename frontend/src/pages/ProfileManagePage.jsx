import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { api, authStorage } from '../services/api';

export default function ProfileManagePage({ currentUser, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingBio, setSavingBio] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  // Add skill form
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [skillType, setSkillType] = useState('TEACH');
  const [experienceNotes, setExperienceNotes] = useState('');

  // Availability form
  const [availabilities, setAvailabilities] = useState([]);
  const [newDay, setNewDay] = useState('MONDAY');
  const [newStart, setNewStart] = useState('14:00');
  const [newEnd, setNewEnd] = useState('16:00');

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, skills] = await Promise.all([
        api.getUserProfile(currentUser.userId),
        api.getSkills()
      ]);
      setProfile(p);
      setAllSkills(skills || []);
      setAvailabilities(p.availabilities || []);
      if (skills && skills.length > 0) setSelectedSkillId(skills[0].skillId);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser.userId]);

  const handleUpdateBio = async (e) => {
    e.preventDefault();
    setSavingBio(true);
    setFeedbackMsg({ text: '', type: '' });
    try {
      const updated = await api.updateProfile(currentUser.userId, {
        name: profile.name,
        college: profile.college,
        department: profile.department,
        academicYear: profile.academicYear,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl
      });
      authStorage.setAuth(authStorage.getToken(), { ...currentUser, ...updated });
      if (onProfileUpdated) onProfileUpdated();
      setFeedbackMsg({ text: 'Profile details saved successfully!', type: 'success' });
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'danger' });
    } finally {
      setSavingBio(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await api.addUserSkill(currentUser.userId, {
        skillId: Number(selectedSkillId),
        proficiency,
        type: skillType,
        experienceDetails: experienceNotes
      });
      setExperienceNotes('');
      setFeedbackMsg({ text: 'Skill added to your profile!', type: 'success' });
      loadData();
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'danger' });
    }
  };

  const handleRemoveSkill = async (userSkillId) => {
    try {
      await api.removeUserSkill(currentUser.userId, userSkillId);
      setFeedbackMsg({ text: 'Skill removed from profile', type: 'success' });
      loadData();
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'danger' });
    }
  };

  const handleAddAvailability = async () => {
    const updated = [...availabilities, { dayOfWeek: newDay, startTime: newStart, endTime: newEnd }];
    try {
      const res = await api.updateAvailability(currentUser.userId, updated);
      setAvailabilities(res);
      setFeedbackMsg({ text: 'Weekly availability updated', type: 'success' });
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'danger' });
    }
  };

  const handleRemoveAvailability = async (index) => {
    const updated = availabilities.filter((_, i) => i !== index);
    try {
      const res = await api.updateAvailability(currentUser.userId, updated);
      setAvailabilities(res);
      setFeedbackMsg({ text: 'Availability slot removed', type: 'success' });
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'danger' });
    }
  };

  if (loading || !profile) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading profile settings...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Profile & Skills Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Configure what you teach, what you want to learn, and when you are free to mentor
        </p>
      </div>

      {feedbackMsg.text && (
        <div className={`alert alert-${feedbackMsg.type}`}>
          {feedbackMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {feedbackMsg.text}
        </div>
      )}

      <div className="grid-2">
        {/* Basic Info & Bio */}
        <div className="card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--primary)" /> Student Information
          </h3>

          <form onSubmit={handleUpdateBio}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Account ID)</label>
              <input 
                type="email" 
                className="form-control"
                value={profile.email}
                disabled
                style={{ background: '#f1f5f9' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / University</label>
              <input 
                type="text" 
                className="form-control"
                value={profile.college || ''}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Department / Branch</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={profile.department || ''}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={profile.academicYear || ''}
                  onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Biography & Interests</label>
              <textarea 
                className="form-control"
                rows={3}
                placeholder="Share your background, passions, and study goals..."
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="https://..."
                value={profile.avatarUrl || ''}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={savingBio}>
              <Save size={16} /> {savingBio ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right side: Skills & Availability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Add Skill to Profile */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--primary)" /> Add Skill to Profile
            </h3>

            <form onSubmit={handleAddSkill}>
              <div className="form-group">
                <label className="form-label">Select Skill</label>
                <select 
                  className="form-control"
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  required
                >
                  {allSkills.map(s => (
                    <option key={s.skillId} value={s.skillId}>{s.skillName} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Type (Role)</label>
                  <select 
                    className="form-control"
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value)}
                  >
                    <option value="TEACH">TEACH (I can mentor)</option>
                    <option value="LEARN">LEARN (I want help)</option>
                    <option value="BOTH">BOTH (Teach & Learn)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Proficiency Level</label>
                  <select 
                    className="form-control"
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Experience Notes (Optional)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Built 3 full-stack React projects, completed leetcode 150..."
                  value={experienceNotes}
                  onChange={(e) => setExperienceNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                <Plus size={16} /> Add Skill to Profile
              </button>
            </form>

            {/* List of current skills */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-muted)' }}>
                YOUR CURRENT SKILLS ({profile.skills?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.skills?.map(s => (
                  <div key={s.userSkillId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{s.skillName}</strong>
                      <span className={`badge badge-${s.type === 'TEACH' ? 'accepted' : 'primary'}`} style={{ marginLeft: '0.5rem' }}>
                        {s.type} &bull; {s.proficiency}
                      </span>
                    </div>
                    <button 
                      className="btn btn-outline btn-sm" 
                      style={{ color: 'var(--danger)', padding: '0.2rem 0.5rem' }}
                      title="Remove skill"
                      onClick={() => handleRemoveSkill(s.userSkillId)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manage Weekly Availability */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--primary)" /> Manage Weekly Availability
            </h3>

            <div className="grid-3" style={{ alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Day</label>
                <select 
                  className="form-control"
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                >
                  {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Start Time</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newStart} 
                  onChange={(e) => setNewStart(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">End Time</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newEnd} 
                  onChange={(e) => setNewEnd(e.target.value)} 
                />
              </div>
            </div>

            <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddAvailability}>
              <Plus size={16} /> Add Availability Slot
            </button>

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {availabilities.map((av, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: '#f8fafc', borderRadius: '4px', fontSize: '0.88rem' }}>
                  <span><strong>{av.dayOfWeek}</strong>: {av.startTime} - {av.endTime}</span>
                  <button 
                    className="btn btn-outline btn-sm" 
                    style={{ color: 'var(--danger)', padding: '0.1rem 0.4rem' }}
                    onClick={() => handleRemoveAvailability(idx)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
