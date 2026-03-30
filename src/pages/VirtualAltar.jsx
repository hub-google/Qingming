import { useState } from 'react'

const VIRTUAL_ITEMS = [
  { id: 1, icon: '🏮', name: '祈福燈', price: 50, desc: '點燈祈福，照亮天路' },
  { id: 2, icon: '🌸', name: '鮮花一束', price: 88, desc: '敬獻芬芳，表達思念' },
  { id: 3, icon: '🍜', name: '愛吃的麵', price: 128, desc: '供奉先人最愛的美食' },
  { id: 4, icon: '🍵', name: '好茶一壺', price: 168, desc: '清香好茶，敬奉天上' },
  { id: 5, icon: '🥃', name: '高粱酒', price: 288, desc: '一杯敬故人，一杯敬自己' },
  { id: 6, icon: '💰', name: '黃金元寶', price: 388, desc: '金光閃爍，護佑全家' },
  { id: 7, icon: '🎎', name: '傳統紙紮', price: 688, desc: '精緻紙紮，表達孝心' },
  { id: 8, icon: '🏠', name: '豪宅紙紮', price: 1688, desc: '極致榮耀，盡顯孝道' },
]

function VirtualAltar({ user }) {
  const [burning, setBurning] = useState(null)
  const [totalDonated, setTotalDonated] = useState(0)
  const [offerings, setOfferings] = useState([])

  const handleOffer = (item) => {
    setBurning(item)
    setOfferings(prev => [item, ...prev])
    setTotalDonated(prev => prev + item.price)
    // Auto-close after 3s
    setTimeout(() => setBurning(null), 3000)
  }

  return (
    <div className="page">
      {/* Burn Overlay */}
      {burning && (
        <div className="burn-overlay">
          <div className="burn-icon">{burning.icon}</div>
          <div className="burn-text">
            🙏 供奉成功<br />
            <span style={{ fontSize: '1.2rem' }}>{burning.name}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginTop: 12, textAlign: 'center' }}>
            願先人在天之靈<br />收到您的心意
          </p>
          <div className="burn-progress">
            <div className="burn-progress-bar" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 8 }}>
            NT$ {burning.price} · 10% 捐入公益基金 🌱
          </p>
          {/* Sparkles */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${10 + i * 11}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              fontSize: '1.5rem',
              animation: `sparkle ${1 + i * 0.2}s ease-out ${i * 0.15}s infinite`,
              opacity: 0,
            }}>✨</div>
          ))}
        </div>
      )}

      <div className="page-header">
        <h1>🌸 線上祭壇</h1>
        <p>點燃心意，讓愛跨越時空傳遞</p>
      </div>


      {/* Altar scene */}
      <div className="altar-bg section">
        <div className="altar-title">🏛 天上人間</div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: 20 }}>
          虔誠供奉，以心傳心
        </p>

        {/* Candles */}
        <div className="candle-row">
          <div className="candle">
            <div className="candle-flame" />
            <div className="candle-body" />
            <div className="candle-label">左燭</div>
          </div>

          {/* Incense */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="incense-stick">
                <div className="incense-smoke" style={{ animationDelay: `${i * 0.8}s` }} />
                <div className="incense-glow" style={{ animationDelay: `${i * 0.5}s` }} />
                <div className="incense-body" style={{ height: `${70 + i * 10}px` }} />
              </div>
            ))}
          </div>

          <div className="candle">
            <div className="candle-flame" style={{ animationDelay: '0.5s' }} />
            <div className="candle-body" />
            <div className="candle-label">右燭</div>
          </div>
        </div>

        {/* Offerings count */}
        {offerings.length > 0 && (
          <div style={{
            background: 'rgba(200,150,12,0.15)',
            border: '1px solid rgba(200,150,12,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            marginTop: 16,
          }}>
            <p style={{ color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>
              已供奉 {offerings.length} 件 · 共 NT$ {totalDonated}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 4 }}>
              {offerings.slice(0, 3).map(o => o.icon).join(' ')} {offerings.length > 3 ? `... +${offerings.length - 3}` : ''}
            </p>
          </div>
        )}
      </div>

      {/* Total donated ESG */}
      {totalDonated > 0 && (
        <div className="esg-card section">
          <div className="esg-header">
            <span className="esg-icon">🌳</span>
            <div>
              <div className="esg-title">您本次公益捐款</div>
              <div className="esg-amount">NT$ {Math.round(totalDonated * 0.1)} (訂單金額 10%)</div>
            </div>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${Math.min((totalDonated / 5000) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Virtual goods */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 14 }}>☁️ 雲端福澤金 · 虛擬供品</div>
        <div className="virtual-items-grid" style={{ background: '#1A0A00', padding: 16, borderRadius: 'var(--radius-md)' }}>
          {VIRTUAL_ITEMS.map(item => (
            <div
              key={item.id}
              id={`btn-virtual-item-${item.id}`}
              className="virtual-item"
              onClick={() => handleOffer(item)}
            >
              <div className="virtual-item-icon">{item.icon}</div>
              <div className="virtual-item-name">{item.name}</div>
              <div className="virtual-item-price">NT$ {item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="section" style={{
        background: 'linear-gradient(135deg, var(--gold-pale), white)',
        border: '1px solid var(--gold-light)',
        borderRadius: 'var(--radius-md)',
        padding: 16,
      }}>
        <h3 style={{ marginBottom: 10, color: 'var(--gold-deep)' }}>🙏 如何使用線上祭壇</h3>
        {[
          '點選上方虛擬供品，輸入意願完成供奉',
          '結帳後觸發全螢幕光芒動畫與溫馨音效',
          '10% 自動捐入公益種樹基金',
          '系統自動發送電子公益收據至您的信箱',
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{
              background: 'var(--gold)',
              color: 'white',
              borderRadius: '50%',
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              flexShrink: 0,
            }}>{i + 1}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualAltar
