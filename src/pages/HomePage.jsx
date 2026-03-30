import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useRoom } from '../contexts/RoomContext'
import LandingPage from '../components/LandingPage'

function HomePage({ user, onLogin }) {
  const { roomId } = useRoom()
  const navigate = useNavigate()
  const [attendance, setAttendance] = useState(null)
  const [members, setMembers] = useState([])
  const [esgTotal, setEsgTotal] = useState(0)
  const esgGoal = 10000
  const [copied, setCopied] = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '家族成員'
  const familyUrl = `${window.location.origin}/Qingming/family/${roomId}`

  useEffect(() => {
    if (user && roomId) {
      fetchData()
    }
  }, [user, roomId])

  const fetchData = async () => {
    // 1. Fetch own attendance
    const { data: ownMember } = await supabase
      .from('QingMing_members')
      .select('attendance_status')
      .eq('family_room_id', roomId)
      .eq('user_id', user.id)
      .single()
    
    if (ownMember) setAttendance(ownMember.attendance_status)

    // 2. Fetch all members
    const { data: allMembers } = await supabase
      .from('QingMing_members')
      .select('user_id, display_name, avatar_url, attendance_status')
      .eq('family_room_id', roomId)
    
    if (allMembers) {
      setMembers(allMembers)
    } else {
      setMembers([{ 
        user_id: user.id, 
        display_name: displayName, 
        avatar_url: user?.user_metadata?.avatar_url || '👤', 
        attendance_status: 'pending' 
      }])
    }

    // 3. Fetch ESG Total
    const { data: esgData } = await supabase
      .from('QingMing_esg_fund')
      .select('amount')
    
    if (esgData) {
      const sum = esgData.reduce((acc, row) => acc + (row.amount || 0), 0)
      setEsgTotal(sum)
    }
  }

  const handleAttendance = async (choice) => {
    setAttendance(choice)
    const { error } = await supabase
      .from('QingMing_members')
      .upsert({
        family_room_id: roomId,
        user_id: user.id,
        display_name: displayName,
        avatar_url: user?.user_metadata?.avatar_url || '👤',
        attendance_status: choice,
        updated_at: new Date().toISOString()
      }, { onConflict: 'family_room_id,user_id' })
    
    if (!error) fetchData()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(familyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareLine = () => {
    const text = encodeURIComponent(`📿 清明家族聚集邀請\n\n今年清明，讓我們用更溫馨的方式相聚！\n${familyUrl}`)
    window.open(`https://line.me/R/msg/text/?${text}`, '_blank')
  }

  // GUEST VIEW
  if (!user) {
    return <LandingPage onLogin={onLogin} />
  }

  // AUTH VIEW (Dashboard)
  const attendCount = members.filter(m => m.attendance_status === 'attend').length
  const absentCount = members.filter(m => m.attendance_status === 'absent').length
  const pendingCount = members.filter(m => m.attendance_status === 'pending').length

  return (
    <div className="page" style={{ padding: '24px 20px 80px' }}>
      {/* Dashboard Hero */}
      <div className="hero-bg" style={{ 
        margin: '-24px -20px 24px', padding: '48px 24px 32px', 
        borderRadius: '0 0 40px 40px', textAlign: 'left',
        boxShadow: '0 10px 30px rgba(132, 99, 88, 0.1)',
        position: 'relative'
      }}>
        {/* Settings Entry */}
        <button 
          onClick={() => navigate('/profile')}
          style={{ 
            position: 'absolute', top: '48px', right: '24px', 
            width: '40px', height: '40px', borderRadius: '50%', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          title="帳號設定"
        >
          ⚙️
        </button>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'white', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-dark)', marginBottom: '16px' }}>
          🗓 2026 清明 · 4月4日
        </div>
        <h1 className="text-serif" style={{ fontSize: '1.8rem', color: 'var(--color-warm-900)', margin: 0 }}>
          歡迎回來，<br /><span className="text-brand-dark">{displayName}</span>
        </h1>
        <p style={{ marginTop: '8px', color: 'var(--color-warm-600)', fontSize: '0.95rem' }}>
          今年清明，讓思念溫馨重聚 🌿
        </p>
      </div>

      {/* Attendance CTA */}
      <div className="section">
        {!attendance || attendance === 'pending' ? (
          <div className="card" style={{ padding: '24px', border: '2px solid var(--color-brand-light)', background: 'linear-gradient(135deg, white, var(--color-warm-50))' }}>
            <h2 className="text-serif" style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '20px' }}>
              ❓ 今年清明，您是否親自出席掃墓？
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => handleAttendance('attend')}
                style={{ 
                  padding: '24px 12px', borderRadius: '20px', border: '1.5px solid var(--color-warm-200)', background: 'white',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '2rem' }}>✅</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>親自出席</span>
              </button>
              <button 
                onClick={() => handleAttendance('absent')}
                style={{ 
                  padding: '24px 12px', borderRadius: '20px', border: '1.5px solid var(--color-warm-200)', background: 'white',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '2rem' }}>🙏</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>無法出席</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ 
            padding: '20px', textAlign: 'center', 
            background: attendance === 'attend' ? 'rgba(67, 48, 43, 0.03)' : 'rgba(217, 119, 6, 0.03)',
            border: `1.5px solid ${attendance === 'attend' ? 'var(--color-warm-800)' : 'var(--color-brand)'}`
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{attendance === 'attend' ? '🌿' : '✨'}</div>
            <p style={{ fontWeight: 700, color: 'var(--color-warm-900)' }}>
              {attendance === 'attend' ? '已排定親自出席交流' : '已為您安排尊榮代客服務'}
            </p>
            <button 
              onClick={() => setAttendance('pending')}
              style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--color-warm-500)', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              更改出席意願
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="text-serif" style={{ fontSize: '1.1rem' }}>👨‍👩‍👧‍👦 家族出席概況</h3>
          <span className="badge badge-gold" style={{ background: 'var(--color-warm-800)', color: 'white', border: 'none' }}>
            {members.length} 人參與
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { num: attendCount, label: '出席', color: 'var(--color-warm-700)' },
            { num: absentCount, label: '代拜', color: 'var(--color-brand)' },
            { num: pendingCount, label: '待定', color: 'var(--color-warm-400)' }
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '12px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.num}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-warm-500)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Member Avatars */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {members.map((m, i) => {
            const isMe = m.user_id === user?.id
            return (
              <div key={i} style={{ textAlign: 'center', maxWidth: '60px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: 'white',
                  border: `2px solid ${m.attendance_status === 'attend' ? 'var(--color-warm-800)' : 'var(--color-brand)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  margin: '0 auto 4px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}>
                  {m.avatar_url && m.avatar_url.startsWith('http') 
                    ? <img src={m.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
                    : (m.avatar_url || '👤')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-warm-700)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.display_name} {isMe && '(您)'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ESG Fund Card */}
      <div className="section card" style={{ padding: '24px', background: 'var(--color-warm-900)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>公益累計福澤</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-brand-light)' }}>NT$ {esgTotal.toLocaleString()}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>🌳</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ width: `${Math.min((esgTotal / esgGoal) * 100, 100)}%`, height: '100%', background: 'var(--color-brand-light)', borderRadius: '4px' }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'space-between' }}>
          <span>進度 {((esgTotal / esgGoal) * 100).toFixed(0)}%</span>
          <span>目標 NT$ {esgGoal.toLocaleString()}</span>
        </div>
      </div>

      {/* Share / Invite Section */}
      <div className="section">
        <h3 className="text-serif" style={{ fontSize: '1.1rem', marginBottom: '14px' }}>📤 邀請家族成員</h3>
        <div className="card" style={{ padding: '20px', background: 'var(--color-warm-50)', border: '1.5px dashed var(--color-warm-300)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-warm-600)', marginBottom: '10px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {familyUrl}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleCopy}
              className="btn btn-outline btn-sm" 
              style={{ flex: 1, background: 'white' }}
            >
              {copied ? '✅ 已複製' : '📋 複製網址'}
            </button>
            <button 
              onClick={handleShareLine}
              className="btn btn-sm" 
              style={{ flex: 1, background: '#06C755', color: 'white' }}
            >
              LINE 分享
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions (Dashboard Grid) */}
      <div className="section">
        <h3 className="text-serif" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>⚡ 快捷服務</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { label: '虛擬追思牆', path: '/memorial', icon: '🕯️', bg: 'var(--color-warm-50)' },
            { label: '線上祭拜', path: '/altar', icon: '🌸', bg: 'var(--color-warm-100)' },
            { label: '訂單追蹤', path: '/order', icon: '📦', bg: 'rgba(245, 158, 11, 0.05)' },
            { label: '春遊行程', path: '/spring', icon: '🌿', bg: 'rgba(132, 99, 88, 0.05)' }
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => navigate(item.path)}
              style={{
                height: '100px', borderRadius: '24px', border: '1.5px solid var(--color-warm-200)',
                background: item.bg, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s',
                ':active': { transform: 'scale(0.95)' }
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-warm-800)' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
