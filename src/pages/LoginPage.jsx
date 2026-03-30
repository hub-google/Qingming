import { useState } from 'react'
import { supabase } from '../lib/supabase'

function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/Qingming/`
        }
      })
      if (error) throw error
    } catch (err) {
      console.error('Google login error:', err)
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // Demo mode — bypass auth for UI preview
    setDemoMode(true)
    onLogin({ id: 'demo', email: 'demo@family.tw', user_metadata: { full_name: '陳家族長', avatar_url: null } })
  }

  return (
    <div className="login-page" style={{ 
      padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '400px', background: 'var(--color-warm-50)'
    }}>
      <div className="login-logo" style={{ fontSize: '3rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🌿</div>
      <h1 className="login-title text-serif" style={{ fontSize: '1.8rem', color: 'var(--color-warm-900)', marginBottom: '8px' }}>清明・家聚</h1>
      <p className="login-sub" style={{ textAlign: 'center', color: 'var(--color-warm-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '32px' }}>
        一站式家族整合平台<br />
        線上追思・虛擬祭祀・代客掃墓・春遊規劃
      </p>

      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          id="btn-google-login"
          className="btn btn-primary"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ width: '100%', gap: '10px' }}
        >
          {loading ? '登入中...' : '使用 Google 帳號登入'}
        </button>

        <button
          id="btn-demo-mode"
          className="btn btn-outline"
          onClick={handleDemoLogin}
          style={{ width: '100%', fontSize: '0.9rem', color: 'var(--color-warm-700)', borderColor: 'var(--color-warm-300)' }}
        >
          🎭 訪客體驗模式
        </button>
      </div>

      <p style={{ marginTop: 32, fontSize: '0.72rem', color: 'var(--color-warm-500)', textAlign: 'center', lineHeight: 1.7 }}>
        登入即表示您同意我們的<span style={{ textDecoration: 'underline' }}>服務條款</span>與<span style={{ textDecoration: 'underline' }}>隱私政策</span>。<br />
        您的家族資料將以加密方式妥善保存。🔒
      </p>
    </div>
  )
}

export default LoginPage
