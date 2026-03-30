import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRoom } from '../contexts/RoomContext'

const STEPS = ['已下單', '受理中', '執行中', '已完成']

function OrderTracking({ user }) {
  const { roomId } = useRoom()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (user && roomId) fetchOrders()
  }, [user, roomId])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('QingMing_orders')
      .select(`
        *,
        QingMing_order_items (
          *,
          QingMing_products (*)
        )
      `)
      .eq('user_id', user.id)
      .eq('family_room_id', roomId)
      .order('created_at', { ascending: false })
    
    if (data) {
      setOrders(data)
      if (data.length > 0 && !selected) {
        setSelected(data[0])
      }
    }
    setLoading(false)
  }

  const getStatusIndex = (status) => {
    const s = status?.toLowerCase()
    if (s === 'pending') return 0
    if (s === 'processing') return 1
    if (s === 'shipping' || s === 'paid') return 2
    if (s === 'completed') return 3
    return 0
  }

  return (
    <div className="page">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="text-serif" style={{ fontSize: '1.8rem', color: 'var(--color-warm-900)' }}>📦 訂單追蹤</h1>
        <p style={{ color: 'var(--color-warm-600)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>代客服務即時進度，讓您安心</p>
      </div>

      {/* Order list */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 14 }}>我的訂單</div>
        {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>載入中...</p>}
        {!loading && orders.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>尚未有任何訂單 🙏</p>}
        {orders.map(order => {
          const itemsText = order.QingMing_order_items?.map(i => i.QingMing_products?.name).join(', ') || '祭祀品'
          return (
            <div
              key={order.id}
              className="card"
              style={{
                marginBottom: 12,
                borderColor: selected?.id === order.id ? 'var(--color-brand)' : 'var(--border)',
                borderWidth: selected?.id === order.id ? 2 : 1,
                cursor: 'pointer',
              }}
              onClick={() => setSelected(order)}
            >
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{itemsText}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{order.id.slice(0, 8)}... · NT$ {order.total_amount}</div>
                  </div>
                  <span className={`badge ${order.status === 'completed' ? 'badge-jade' : 'badge-gold'}`}>
                    {STEPS[getStatusIndex(order.status)]}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order detail */}
      {selected && (
        <div className="section card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-body">
            <h2 className="text-serif" style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--color-warm-800)' }}>
              📋 訂單詳情
            </h2>

            {/* Step tracker */}
            <div className="order-steps">
              {STEPS.map((step, i) => {
                const currentIdx = getStatusIndex(selected.status)
                return (
                  <div key={i} className={`order-step${i < currentIdx ? ' done' : i === currentIdx ? ' active' : ''}`}>
                    <div className="step-circle">
                      {i < currentIdx ? '✓' : i === currentIdx ? '●' : i + 1}
                    </div>
                    <div className="step-label">{step}</div>
                  </div>
                )
              })}
            </div>

            <div className="divider" />

            {/* Info */}
            {[
              { label: '📅 下單日期', value: new Date(selected.created_at).toLocaleDateString() },
              { label: '💳 付款狀態', value: selected.payment_status === 'paid' ? '✅ 已完成' : '⏳ 待完成' },
              { label: '📦 取貨資訊', value: selected.pickup_info ? `${selected.pickup_info.date} · ${selected.pickup_info.location}` : '代客服務' },
              { label: '👷 服務師傅', value: '系統指派中' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                fontSize: '0.85rem',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{item.value}</span>
              </div>
            ))}

            {/* Photos (Mock for completed) */}
            {selected.status === 'completed' && (
              <>
                <div className="divider" />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  📸 現場照片
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', borderRadius: 'var(--radius-sm)', padding: '20px 10px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>📷</div>施工前
                  </div>
                  <div style={{ background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', borderRadius: 'var(--radius-sm)', padding: '20px 10px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>📷</div>供奉後
                  </div>
                </div>
                <button className="btn btn-outline btn-full" style={{ marginTop: 16 }}>
                  📄 下載公益收據 PDF
                </button>
              </>
            )}

            {/* Live CTA for processing */}
            {selected.status !== 'completed' && (
              <>
                <div className="divider" />
                <div style={{ background: 'var(--jade-pale)', border: '1px solid var(--jade)', borderRadius: 'var(--radius-sm)', padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>📡</div>
                  <div style={{ fontWeight: 700, color: 'var(--jade)', fontSize: '0.9rem' }}>即時進度同步中</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>我們將在掃墓當天提供即時相片回報。</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTracking
