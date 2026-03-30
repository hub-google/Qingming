import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('密碼與確認密碼不一致')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => navigate('/'), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page" style={{ 
      padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100dvh', background: 'var(--color-warm-50)'
    }}>
      <div className="login-logo" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>🛡️</div>
      <h1 className="text-serif" style={{ fontSize: '1.8rem', color: 'var(--color-warm-900)', marginBottom: '8px' }}>
        設定新密碼
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--color-warm-600)', marginBottom: '32px', fontSize: '0.95rem' }}>
        請為您的帳號設定一個既安全又好記的新密碼。
      </p>

      {error && <div style={{ background: '#FFF0F0', color: '#D93025', padding: '12px', borderRadius: '12px', width: '100%', maxWidth: '320px', marginBottom: '20px', border: '1px solid #FFCDD2' }}>⚠️ {error}</div>}
      {success && <div style={{ background: '#E8F5EE', color: '#2D7A4F', padding: '12px', borderRadius: '12px', width: '100%', maxWidth: '320px', marginBottom: '20px', border: '1px solid #C8E6C9' }}>✅ 密碼重設成功！跳轉至登入中...</div>}

      <form onSubmit={handleReset} style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input 
          type="password" 
          className="form-input" 
          placeholder="輸入新密碼" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <input 
          type="password" 
          className="form-input" 
          placeholder="再次輸入新密碼" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || success}
          style={{ width: '100%', height: '54px' }}
        >
          {loading ? '重設中...' : '確認修改'}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
