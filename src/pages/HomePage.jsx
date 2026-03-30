import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const FAMILY_UUID = 'f8c2a3d1-4e5f-6789-abcd-ef0123456789'

const MEMBERS_MOCK = [
  { name: '爸爸', avatar: '👴', status: 'attend' },
  { name: '媽媽', avatar: '👩', status: 'attend' },
  { name: '大哥', avatar: '👨', status: 'absent' },
  { name: '二姊', avatar: '👩', status: 'attend' },
  { name: '小妹', avatar: '👧', status: 'pending' },
  { name: '叔叔', avatar: '🧔', status: 'attend' },
]

function HomePage({ user }) {
  const navigate = useNavigate()
  const [attendance, setAttendance] = useState(null) // null | 'attend' | 'absent'
  const [copied, setCopied] = useState(false)
  const [esgAmount] = useState(3280)
  const [esgGoal] = useState(10000)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '家族成員'
  const familyUrl = `${window.location.origin}/Qingming/family/${FAMILY_UUID}`

  const attendCount = MEMBERS_MOCK.filter(m => m.status === 'attend').length
  const absentCount = MEMBERS_MOCK.filter(m => m.status === 'absent').length
  const pendingCount = MEMBERS_MOCK.filter(m => m.status === 'pending').length

  const handleAttendance = async (choice) => {
    setAttendance(choice)
    // In production: upsert to Supabase members table
    // await supabase.from('members').upsert({ family_id: FAMILY_UUID, user_id: user.id, status: choice })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(familyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareLine = () => {
    const text = encodeURIComponent(`📿 清明家族聚集邀請\n\n今年清明，讓我們用更溫馨的方式相聚！\n請點擊連結填寫出席意願：\n${familyUrl}`)
    window.open(`https://line.me/R/msg/text/?${text}`, '_blank')
  }

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-date">🗓 2026 清明 · 4月4日</div>
        <h1>歡迎回來，{displayName}！</h1>
        <p className="hero-sub">今年清明，讓愛跨越時空 🌸</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-sm" id="btn-go-shop" onClick={() => navigate('/shop')}>
            🛒 祭品預購
          </button>
          <button className="btn btn-outline btn-sm" id="btn-go-altar" onClick={() => navigate('/altar')}
            style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
            🕯️ 線上祭拜
          </button>
        </div>
      </div>

      {/* Attendance Poll */}
      {!attendance ? (
        <div className="poll-card section">
          <p className="poll-title">❓ 今年清明，您是否親自出席掃墓？</p>
          <div className="poll-options">
            <button
              id="btn-attend-yes"
              className={`poll-option ${attendance === 'attend' ? 'selected-attend' : ''}`}
              onClick={() => handleAttendance('attend')}
            >
              <span className="poll-option-icon">✅</span>
              <span>親自出席</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>供品懶人包</span>
            </button>
            <button
              id="btn-attend-no"
              className={`poll-option ${attendance === 'absent' ? 'selected-absent' : ''}`}
              onClick={() => handleAttendance('absent')}
            >
              <span className="poll-option-icon">🙏</span>
              <span>無法出席</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>代客掃墓</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="section">
          <div className="card" style={{
            background: attendance === 'attend' ? 'linear-gradient(135deg, #E8F5EE, white)' : 'linear-gradient(135deg, #FFF0F0, white)',
            borderColor: attendance === 'attend' ? 'var(--jade)' : 'var(--crimson-light)'
          }}>
            <div className="card-body text-center">
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
                {attendance === 'attend' ? '✅' : '🙏'}
              </div>
              <p style={{ fontWeight: 700, color: attendance === 'attend' ? 'var(--jade)' : 'var(--crimson)' }}>
                {attendance === 'attend' ? '已確認親自出席！' : '已記錄，為您安排代客服務'}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
                {attendance === 'attend' ? '前往預購供品懶人包 🎁' : '查看代客掃墓服務方案 🚗'}
              </p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 14 }}
                onClick={() => navigate('/shop')}
              >
                {attendance === 'attend' ? '預購供品' : '代客服務'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">👨‍👩‍👧‍👦 家族出席總覽</span>
          <span className="badge badge-gold">{MEMBERS_MOCK.length} 人</span>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{attendCount}</div>
            <div className="stat-label">✅ 出席</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{absentCount}</div>
            <div className="stat-label">🙏 代拜</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">⏳ 待回覆</div>
          </div>
        </div>

        {/* Members avatars */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {MEMBERS_MOCK.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: m.status === 'attend' ? 'var(--jade-pale)' : m.status === 'absent' ? 'var(--crimson-pale)' : 'var(--gold-pale)',
                border: `2px solid ${m.status === 'attend' ? 'var(--jade)' : m.status === 'absent' ? 'var(--crimson-light)' : 'var(--gold-light)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>{m.avatar}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ESG Progress */}
      <div className="esg-card section">
        <div className="esg-header">
          <span className="esg-icon">🌱</span>
          <div>
            <div className="esg-title">公益種樹基金</div>
            <div className="esg-amount">本月累積捐款 NT$ {esgAmount.toLocaleString()}</div>
          </div>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${(esgAmount / esgGoal) * 100}%` }} />
        </div>
        <div className="progress-text">{((esgAmount / esgGoal) * 100).toFixed(0)}% / 目標 NT$ {esgGoal.toLocaleString()}</div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
          每筆交易 10% 自動捐入公益基金，感謝您的參與 🙏
        </p>
      </div>

      {/* Family Room Share */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 14 }}>📤 邀請家族成員</div>
        <div className="room-share-card">
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 4 }}>您的家族專屬連結</p>
          <div className="room-url">{familyUrl}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button id="btn-copy-link" className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={handleCopy}>
              {copied ? '✅ 已複製' : '📋 複製連結'}
            </button>
            <button id="btn-share-line" className="btn btn-jade btn-sm" style={{ flex: 1 }} onClick={handleShareLine}>
              分享至 LINE
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 14 }}>⚡ 快捷功能</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '🕯️', label: '虛擬追思牆', path: '/memorial', color: '#FFF3D0', border: 'var(--gold-light)' },
            { icon: '🌸', label: '線上祭壇', path: '/altar', color: '#FFF0F0', border: '#FFB3B3' },
            { icon: '📦', label: '訂單追蹤', path: '/order', color: 'var(--jade-pale)', border: '#9FD4B5' },
            { icon: '🌿', label: '春遊推薦', path: '/spring', color: 'var(--gold-pale)', border: 'var(--gold-light)' },
          ].map((item, i) => (
            <button
              key={i}
              id={`btn-quick-${i}`}
              onClick={() => navigate(item.path)}
              style={{
                background: item.color,
                border: `1.5px solid ${item.border}`,
                borderRadius: 'var(--radius-md)',
                padding: '18px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'var(--transition)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
