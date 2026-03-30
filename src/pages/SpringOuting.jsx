import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRoom } from '../contexts/RoomContext'

function SpringOuting() {
  const { roomId } = useRoom()
  const [springItems, setSpringItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState({ name: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('QingMing_affiliate_links')
      .select('*')
      .eq('is_active', true)
    
    if (data) {
      // Group by category
      const grouped = data.reduce((acc, item) => {
        const cat = item.category || '其他推薦'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
      }, {})
      setSpringItems(Object.entries(grouped).map(([category, items]) => ({ category, items })))
    }
    setLoading(false)
  }

  const handleAffiliate = (url, title) => {
    console.log(`Affiliate click: ${title}`)
    window.open(url, '_blank')
  }

  const handleLeadSubmit = async () => {
    if (!lead.name || !lead.phone) return
    setSubmitting(true)
    const { error } = await supabase.from('QingMing_leads').insert({
      family_room_id: roomId,
      name: lead.name,
      phone: lead.phone,
      source: 'spring_outing_consult'
    })
    
    if (!error) {
      setMessage('✅ 預約已送出，專員將盡快與您聯繫！')
      setLead({ name: '', phone: '' })
    }
    setSubmitting(false)
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌿 春遊導購</h1>
        <p>清明出遊周邊推薦，一站式安排</p>
      </div>

      {/* Intro */}
      <div style={{
        background: 'linear-gradient(135deg, var(--jade-pale), #F0FFF5)',
        border: '1.5px solid var(--jade)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: 24,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1.5rem' }}>🌸</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--jade)', fontSize: '0.95rem', marginBottom: 4 }}>
            清明連假春遊去！
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            掃墓之餘，帶著家人好好遊覽台灣。以下是為您精選的春遊推薦，每筆訂單均支持公益基金。
          </p>
        </div>
      </div>

      {/* Categories */}
      {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>載入中...</p>}
      {!loading && springItems.map((cat, ci) => (
        <div key={ci} className="section">
          <div className="section-title" style={{ marginBottom: 14 }}>{cat.category}</div>
          {cat.items.map(item => (
            <div
              key={item.id}
              id={`btn-spring-${item.id}`}
              className="spring-card"
              onClick={() => handleAffiliate(item.link_url, item.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="spring-card-emoji">{item.icon_emoji || '🔗'}</div>
              <div className="spring-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div className="spring-card-title">{item.title}</div>
                  {item.tag && <span className="badge badge-gold" style={{ fontSize: '0.65rem', flexShrink: 0 }}>{item.tag}</span>}
                </div>
                <div className="spring-card-desc">{item.description}</div>
                <div className="spring-card-tag">↗ 點擊查看優惠方案</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Lead gen CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0A30, #0D0020)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>💎</div>
        <h2 style={{ color: 'var(--gold-light)', fontSize: '1.1rem', marginBottom: 8 }}>
          免費塔位健檢諮詢
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 18 }}>
          趁早規劃，讓家人安心。預約免費塔位健檢，<br />
          了解各地塔位行情與規劃建議。
        </p>
        
        {message ? (
          <div style={{ color: 'var(--gold-light)', padding: '20px', fontWeight: 600 }}>{message}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              id="input-lead-name"
              className="form-input"
              placeholder="您的姓名"
              value={lead.name}
              onChange={e => setLead(prev => ({ ...prev, name: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            />
            <input
              id="input-lead-phone"
              className="form-input"
              placeholder="聯絡電話"
              type="tel"
              value={lead.phone}
              onChange={e => setLead(prev => ({ ...prev, phone: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            />
            <button
              id="btn-lead-submit"
              className="btn btn-primary"
              disabled={submitting}
              onClick={handleLeadSubmit}
            >
              {submitting ? '⌛ 處理中...' : '🏛 預約免費諮詢'}
            </button>
          </div>
        )}
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: 12 }}>
          您的資料將以加密方式保存，不會外洩給第三方
        </p>
      </div>
    </div>
  )
}

export default SpringOuting
