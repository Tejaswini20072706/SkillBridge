import React, { useState } from 'react';
import { LogIn, AlertCircle, Key, CheckCircle } from 'lucide-react';
import { api, authStorage } from '../services/api';

export default function LoginPage({ setCurrentView, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      authStorage.setAuth(res.token, res);
      onAuthSuccess(res);
      setCurrentView('dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError('');
    try {
      const res = await api.login({ email: demoEmail, password: 'password123' });
      authStorage.setAuth(res.token, res);
      onAuthSuccess(res);
      setCurrentView('dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '2.5rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Log in to continue your peer mentoring sessions
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. aarav@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            <LogIn size={18} /> {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login Pill for Examiner / Evaluator */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Key size={14} /> Quick One-Click Demo Profiles:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button 
              type="button" 
              className="btn btn-outline btn-sm" 
              style={{ justifyContent: 'flex-start', background: '#ffffff' }}
              onClick={() => loginDemo('aarav@example.com')}
            >
              👨‍💻 Aarav Sharma (Java/Spring Mentor)
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm" 
              style={{ justifyContent: 'flex-start', background: '#ffffff' }}
              onClick={() => loginDemo('priya@example.com')}
            >
              👩‍🎨 Priya Patel (Figma/UI Design Mentor)
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm" 
              style={{ justifyContent: 'flex-start', background: '#ffffff' }}
              onClick={() => loginDemo('rohan@example.com')}
            >
              🤖 Rohan Verma (Python/AI Mentor)
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          Don't have an account yet?{' '}
          <span 
            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setCurrentView('register')}
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}
