import { useState } from 'react'

const ORDERS = [
  {
    id: 'QM-20260404-001',
    service: '代客掃墓・直播方案',
    worker: '李師傅 ⭐ 4.9',
    location: '台北市內湖區碧湖公園',
    status: 1, // 0: 未接單, 1: 執行中, 2: 已完成
    date: '2026-04-04',
    photos: ['📸 施工前照片', '📸 施工後照片'],
    gps: '25.0802° N, 121.5680° E',
  },
  {
    id: 'QM-20260403-002',
    service: '代燒金紙・標準包',
    worker: '陳師傅 ⭐ 4.8',
    location: '新北市汐止區',
    status: 2,
    date: '2026-04-03',
    photos: ['📸 施工前照片', '📸 施工後照片'],
    gps: '25.0663° N, 121.6548° E',
  },
]

const STEPS = ['已下單', '執行中', '已完成']

function OrderTracking() {
  const [selected, setSelected] = useState(ORDERS[0])

  return (
    <div className="page">
      <div className="page-header">
        <h1>📦 訂單追蹤</h1>
        <p>代客服務即時進度，讓您安心</p>
      </div>

      {/* Order list */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 14 }}>我的訂單</div>
        {ORDERS.map(order => (
          <div
            key={order.id}
            className="card"
            style={{
              marginBottom: 12,
              borderColor: selected.id === order.id ? 'var(--gold)' : 'var(--border)',
              borderWidth: selected.id === order.id ? 2 : 1,
              cursor: 'pointer',
            }}
            onClick={() => setSelected(order)}
          >
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{order.service}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.id}</div>
                </div>
                <span className={`badge ${order.status === 2 ? 'badge-jade' : order.status === 1 ? 'badge-gold' : 'badge-crimson'}`}>
                  {STEPS[order.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order detail */}
      {selected && (
        <div className="section card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-body">
            <h2 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--crimson)' }}>
              📋 {selected.service}
            </h2>

            {/* Step tracker */}
            <div className="order-steps">
              {STEPS.map((step, i) => (
                <div key={i} className={`order-step${i < selected.status ? ' done' : i === selected.status ? ' active' : ''}`}>
                  <div className="step-circle">
                    {i < selected.status ? '✓' : i === selected.status ? '●' : i + 1}
                  </div>
                  <div className="step-label">{step}</div>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* Info */}
            {[
              { label: '📅 服務日期', value: selected.date },
              { label: '👷 服務人員', value: selected.worker },
              { label: '📍 服務地點', value: selected.location },
              { label: '🛰 GPS 定位', value: selected.gps },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                fontSize: '0.88rem',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%' }}>{item.value}</span>
              </div>
            ))}

            {/* Photos */}
            {selected.status >= 1 && (
              <>
                <div className="divider" />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  📸 現場照片
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {selected.photos.map((p, i) => (
                    <div key={i} style={{
                      background: 'var(--gold-pale)',
                      border: '1px solid var(--gold-light)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '20px 10px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>📷</div>
                      {p}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Live video */}
            {selected.status === 1 && selected.service.includes('直播') && (
              <>
                <div className="divider" />
                <button id="btn-join-live" className="btn btn-crimson btn-full">
                  📡 加入即時直播
                </button>
              </>
            )}

            {/* Completed review */}
            {selected.status === 2 && (
              <>
                <div className="divider" />
                <div style={{
                  background: 'var(--jade-pale)',
                  border: '1px solid var(--jade)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 14,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>✅</div>
                  <div style={{ fontWeight: 700, color: 'var(--jade)', fontSize: '0.95rem' }}>服務已完成</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>感謝您的信任，願先人安息 🙏</div>
                </div>
                <button id="btn-download-receipt" className="btn btn-outline btn-full" style={{ marginTop: 12 }}>
                  📄 下載公益收據 PDF
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTracking
