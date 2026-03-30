import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ProfileSettings({ user }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Fields
  const [newEmail, setNewEmail] = useState(user?.email || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      setMessage('電子郵件更新已發送！請同時檢查「新」與「舊」信箱的確認連結以生效。')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setError('密碼與確認密碼不一致')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setMessage('密碼更新成功！下次登入請使用新密碼。')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="page" style={{ padding: '24px 20px 80px', background: 'var(--color-warm-50)', minHeight: '100dvh' }}>
      <header style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'white', width: '40px', height: '40px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}>←</button>
        <h1 className="text-serif" style={{ fontSize: '1.5rem', color: 'var(--color-warm-900)', margin: 0 }}>帳號設定</h1>
      </header>

      {error && <div style={{ background: '#FFF0F0', color: '#D93025', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #FFCDD2', fontSize: '0.9rem' }}>⚠️ {error}</div>}
      {message && <div style={{ background: '#E8F5EE', color: '#2D7A4F', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #C8E6C9', fontSize: '0.9rem' }}>✅ {message}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Email Change */}
        <section className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>📧 修改電子郵件</h2>
          <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="email" 
              className="form-input" 
              placeholder="新電子郵件" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required 
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading} style={{ width: '100%' }}>
              發送變更連結
            </button>
          </form>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.5 }}>
            * 基於安全考量，變更 Email 需要在兩邊信箱點擊確認信。
          </p>
        </section>

        {/* Password Change */}
        <section className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>🔐 修改密碼</h2>
          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="password" 
              className="form-input" 
              placeholder="新密碼" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
            />
            <input 
              type="password" 
              className="form-input" 
              placeholder="確認新密碼" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading} style={{ width: '100%' }}>
              確認修改密碼
            </button>
          </form>
        </section>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          style={{ 
            marginTop: '12px', padding: '16px', borderRadius: '16px', border: '1.5px solid #FF5252', background: 'rgba(255, 82, 82, 0.05)',
            color: '#FF5252', fontWeight: 700, cursor: 'pointer', transition: '0.2s'
          }}
        >
          🚪 登出帳號
        </button>
      </div>

      <footer style={{ marginTop: '48px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.6 }}>
        User ID: {user?.id}
      </footer>
    </div>
  )
}

export default ProfileSettings
