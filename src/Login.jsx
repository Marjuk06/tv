import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import logo from './assets/CodenestLIVE_TV_bg_removed.png';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{
        background: 'rgba(15, 15, 20, 0.7)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 40,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src={logo} alt="Codenest Live TV" style={{ height: 48, objectFit: 'contain', marginBottom: 24 }} />
          <h2 style={{ margin: 0, color: 'white', fontSize: 24, fontWeight: 600 }}>Admin Access</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Sign in to manage channels and categories.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: '#fca5a5' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: 14 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '14px 16px 14px 44px',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '14px 16px 14px 44px',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              padding: '14px 24px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            {loading ? 'Signing in...' : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}>
            ← Back to TV Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
