import { useState } from 'react'
import { supabase } from '../lib/supabase'

function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/Qingming/`
        }
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onLogin(data.user)
      } else if (authMode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('密碼與確認密碼不一致')
        }
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: email.split('@')[0] }
          }
        })
        if (error) throw error
        setMessage('註冊成功！請檢查信箱進行驗證（若 Supabase 已關閉驗證，請直接登入）')
        setAuthMode('login')
      } else if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setMessage('重設密碼連結已發送至您的信箱')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page" style={{ 
      padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '400px', background: 'var(--color-warm-50)'
    }}>
      <div className="login-logo" style={{ fontSize: '3rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🌿</div>
      <h1 className="login-title text-serif" style={{ fontSize: '1.8rem', color: 'var(--color-warm-900)', marginBottom: '8px' }}>
        {authMode === 'login' ? '歡迎回來' : authMode === 'register' ? '建立新帳號' : '找回密碼'}
      </h1>
      <p className="login-sub" style={{ textAlign: 'center', color: 'var(--color-warm-600)', fontSize: '0.9rem', marginBottom: '24px' }}>
        {authMode === 'login' ? '登入即享家族追思與掃墓整合服務' : authMode === 'register' ? '一分鐘內完成註冊，守護家族點滴' : '我們將發送連結，協助您安全重設密碼'}
      </p>

      {/* Error/Message feedback */}
      {error && <div style={{ background: '#FFF0F0', color: '#D93025', padding: '10px 16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '20px', width: '100%', maxWidth: '320px', border: '1px solid #FFCDD2' }}>⚠️ {error}</div>}
      {message && <div style={{ background: '#E8F5EE', color: '#2D7A4F', padding: '10px 16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '20px', width: '100%', maxWidth: '320px', border: '1px solid #C8E6C9' }}>✅ {message}</div>}

      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Email form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <input 
              type="email" 
              className="form-input" 
              placeholder="電子郵件 Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          {authMode !== 'forgot' && (
            <div className="form-group">
              <input 
                type="password" 
                className="form-input" 
                placeholder="密碼 Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={authMode !== 'forgot'}
              />
            </div>
          )}

          {authMode === 'register' && (
            <div className="form-group">
              <input 
                type="password" 
                className="form-input" 
                placeholder="確認密碼 Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={authMode === 'register'}
              />
            </div>
          )}

          {authMode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-4px' }}>
              <button 
                type="button"
                onClick={() => setAuthMode('forgot')}
                style={{ fontSize: '0.8rem', color: 'var(--color-warm-600)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                忘記密碼？
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? '處理中...' : authMode === 'login' ? '立即登入' : authMode === 'register' ? '完成註冊' : '發送重設郵件'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-warm-200)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-warm-400)' }}>或</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-warm-200)' }}></div>
        </div>

        {/* Google OAuth (only for login or fallback) */}
        <button
          id="btn-google-login"
          className="btn btn-outline"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ width: '100%', gap: '10px', background: 'white' }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Google 帳號快速登入
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          {authMode === 'login' ? (
            <button 
              onClick={() => setAuthMode('register')}
              style={{ fontSize: '0.9rem', color: 'var(--color-brand-dark)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              沒有帳號？現在註冊
            </button>
          ) : (
            <button 
              onClick={() => setAuthMode('login')}
              style={{ fontSize: '0.9rem', color: 'var(--color-warm-700)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              回登入
            </button>
          )}
        </div>
      </div>

      <p style={{ marginTop: 32, fontSize: '0.72rem', color: 'var(--color-warm-500)', textAlign: 'center', lineHeight: 1.7 }}>
        登入即表示您同意我們的<span style={{ textDecoration: 'underline', cursor: 'pointer' }}>服務條款</span>與<span style={{ textDecoration: 'underline', cursor: 'pointer' }}>隱私政策</span>。<br />
        您的家族資料將以加密方式妥善保存。🔒
      </p>
    </div>
  )
}

export default LoginPage
