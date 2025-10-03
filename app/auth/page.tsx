'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Waves, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setSuccess(result.message);
          // Redirect will happen via useEffect
        } else {
          setError(result.message);
        }
      } else {
        // Validate registration
        if (!formData.name.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        
        const result = await register(formData.email, formData.password, formData.name);
        if (result.success) {
          setSuccess(result.message);
          // Redirect will happen via useEffect
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{
        maxWidth: '450px',
        margin: '0 auto',
        padding: '120px 2rem 4rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(30, 58, 95, 0.3)',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '1px solid rgba(255, 239, 191, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
              borderRadius: '50%',
              marginBottom: '1rem'
            }}>
              <Waves size={40} color="white" />
            </div>
            
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#ffefbf',
              marginBottom: '0.5rem'
            }}>
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            
            <p style={{
              color: 'rgba(255, 239, 191, 0.7)',
              fontSize: '0.875rem'
            }}>
              {isLogin 
                ? 'Sign in to access your diving dashboard' 
                : 'Create an account to start your diving journey'}
            </p>
          </div>

          {/* Demo Credentials Info */}
          {isLogin && (
            <div style={{
              background: 'rgba(140, 218, 63, 0.1)',
              border: '1px solid rgba(140, 218, 63, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ 
                color: '#8cda3f', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                fontWeight: 600 
              }}>
                Demo Credentials:
              </p>
              <p style={{ color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                Admin: admin@suncoastdive.com / admin123
              </p>
              <p style={{ color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.8rem' }}>
                User: user@example.com / user123
              </p>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={18} color="#ff6b6b" />
              <span style={{ color: '#ff6b6b', fontSize: '0.875rem' }}>{error}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(140, 218, 63, 0.1)',
                border: '1px solid rgba(140, 218, 63, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#8cda3f',
                fontSize: '0.875rem'
              }}
            >
              {success}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 239, 191, 0.5)'
                  }} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Diver"
                    required={!isLogin}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 44px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 239, 191, 0.2)',
                      borderRadius: '8px',
                      color: '#ffefbf',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                color: '#ffefbf',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                fontWeight: 500
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 239, 191, 0.5)'
                }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                color: '#ffefbf',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                fontWeight: 500
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 239, 191, 0.5)'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 44px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 239, 191, 0.5)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 239, 191, 0.5)'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required={!isLogin}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 44px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 239, 191, 0.2)',
                      borderRadius: '8px',
                      color: '#ffefbf',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading 
                  ? 'rgba(140, 218, 63, 0.5)' 
                  : 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '1rem'
              }}
            >
              {isLoading 
                ? 'Processing...' 
                : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div style={{
            textAlign: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 239, 191, 0.1)'
          }}>
            <p style={{
              color: 'rgba(255, 239, 191, 0.7)',
              fontSize: '0.875rem'
            }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8cda3f',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginLeft: '0.5rem',
                  textDecoration: 'underline'
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}