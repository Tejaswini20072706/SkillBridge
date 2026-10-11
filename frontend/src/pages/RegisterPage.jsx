import React, { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api, authStorage } from '../services/api';

export default function RegisterPage({ setCurrentView, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    department: '',
    academicYear: '3rd Year'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await api.register(formData);
      authStorage.setAuth(res.token, res);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        onAuthSuccess(res);
        setCurrentView('profile-manage');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Join SkillBridge</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Connect with campus peers, exchange skills & micro-mentor
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="form-control" 
              placeholder="e.g. Tejaswini Nagubandi"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              placeholder="e.g. student@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 characters)</label>
            <input 
              type="password" 
              name="password"
              className="form-control" 
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">College / University Name</label>
            <input 
              type="text" 
              name="college"
              className="form-control" 
              placeholder="e.g. Stanford University / MIT College of Engg"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department / Major</label>
              <input 
                type="text" 
                name="department"
                className="form-control" 
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select 
                name="academicYear"
                className="form-control" 
                value={formData.academicYear}
                onChange={handleChange}
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Graduate / Masters">Graduate / Masters</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register as Student'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <span 
            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setCurrentView('login')}
          >
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
}
