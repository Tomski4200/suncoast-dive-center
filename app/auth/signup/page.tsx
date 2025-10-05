'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Waves, AlertCircle, CheckCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }}>
        <Navigation />

        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '120px 2rem 4rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '16px',
              padding: '3rem',
              border: '1px solid rgba(255, 239, 191, 0.1)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                borderRadius: '50%',
                marginBottom: '1.5rem'
              }}
            >
              <CheckCircle size={50} color="white" />
            </motion.div>

            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#ffefbf',
              marginBottom: '1rem'
            }}>
              Check Your Email!
            </h2>

            <p style={{
              color: 'rgba(255, 239, 191, 0.8)',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              We've sent a confirmation link to <strong style={{ color: '#8cda3f' }}>{email}</strong>
            </p>

            <div style={{
              background: 'rgba(140, 218, 63, 0.1)',
              border: '1px solid rgba(140, 218, 63, 0.3)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <h3 style={{
                color: '#8cda3f',
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '0.75rem'
              }}>
                Next Steps:
              </h3>
              <ol style={{
                color: 'rgba(255, 239, 191, 0.8)',
                fontSize: '0.875rem',
                paddingLeft: '1.25rem',
                lineHeight: '1.8'
              }}>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>You'll be redirected to your dashboard</li>
              </ol>
            </div>

            <Link
              href="/auth/login"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Back to Login
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />

      <div style={{
        maxWidth: '500px',
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
              Join Us
            </h2>

            <p style={{
              color: 'rgba(255, 239, 191, 0.7)',
              fontSize: '0.875rem'
            }}>
              Create an account to start your diving journey
            </p>
          </div>

          {/* Error Message */}
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

          {/* Form */}
          <form onSubmit={handleSignup}>
            {/* Full Name Field */}
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
                  id="full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Diver"
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

            {/* Email Field */}
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
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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

            {/* Password Field */}
            <div style={{ marginBottom: '1.5rem' }}>
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
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
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
              <p style={{
                color: 'rgba(255, 239, 191, 0.6)',
                fontSize: '0.75rem',
                marginTop: '0.5rem'
              }}>
                Minimum 6 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading
                  ? 'rgba(140, 218, 63, 0.5)'
                  : 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '1rem'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
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
              Already have an account?{' '}
              <Link
                href="/auth/login"
                style={{
                  color: '#8cda3f',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
