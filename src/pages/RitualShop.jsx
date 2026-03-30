import { useState } from 'react'

const TABS = ['親自出席', '無法出席']

const ATTEND_PRODUCTS = [
  {
    id: 1, icon: '🧺', name: '傳統祭拜懶人包 A',
    desc: '包含：五果、三牲、米酒、金紙、香燭，一包搞定所有祭拜需求！',
    price: 880, tag: '熱銷第一'
  },
  {
    id: 2, icon: '🌸', name: '精緻花卉供品組',
    desc: '季節鮮花搭配傳統紙錢，適合送給長輩在天之靈。',
    price: 580, tag: '人氣推薦'
  },
  {
    id: 3, icon: '🍱', name: '全素祭拜套餐',
    desc: '精選全素供品，尊重信仰差異，誠心最重要。',
    price: 680, tag: '素食首選'
  },
  {
    id: 4, icon: '🎁', name: '家族豪華祭拜組',
    desc: '適合 10 人以上大家族，內含三牲、五果、酒水、金紙完整組合。',
    price: 2880, tag: '家族首選'
  },
]

const ABSENT_PRODUCTS = [
  {
    id: 5, icon: '🚗', name: '代客掃墓・基本方案',
    desc: '專業人員前往掃墓、清理墓地、上香供品，並提供施工前後完整照片。',
    price: 1500, tag: '含前後照'
  },
  {
    id: 6, icon: '📹', name: '代客掃墓・直播方案',
    desc: '線上即時影像直播，讓您在家也能「親眼」看見掃墓過程。',
    price: 2500, tag: '含直播'
  },
  {
    id: 7, icon: '🔥', name: '代燒金紙・標準包',
    desc: '由專業人員代您燒化金紙，附上祈福文書與 GPS 打卡紀錄。',
    price: 800, tag: '最人氣'
  },
  {
    id: 8, icon: '💎', name: '代客掃墓・尊榮全包',
    desc: '包含代掃、代燒、直播、鮮花供奉，再附電子公益收據。',
    price: 3880, tag: '全包服務'
  },
]

function RitualShop({ user }) {
  const [tab, setTab] = useState(0)
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)

  const products = tab === 0 ? ATTEND_PRODUCTS : ABSENT_PRODUCTS

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
    showToast(`已加入購物車：${product.name}`)
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div className="page">
      <div className="page-header">
        <h1>🛒 祭祀商城</h1>
        <p>智慧分流・出席或代拜，一鍵搞定</p>
      </div>

      {/* Tab */}
      <div className="tab-group section">
        {TABS.map((t, i) => (
          <button
            key={i}
            id={`tab-shop-${i}`}
            className={`tab-btn${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
          >
            {i === 0 ? '✅ ' : '🙏 '}{t}
          </button>
        ))}
      </div>

      {/* Context hint */}
      <div style={{
        background: tab === 0 ? 'var(--jade-pale)' : 'var(--crimson-pale)',
        border: `1.5px solid ${tab === 0 ? 'var(--jade)' : 'var(--crimson-light)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        marginBottom: 20,
        fontSize: '0.85rem',
        color: tab === 0 ? 'var(--jade)' : 'var(--crimson)',
        fontWeight: 500,
      }}>
        {tab === 0
          ? '🌿 您選擇親自出席，建議提前預購供品！可選擇取貨日期與地點。'
          : '🙏 您無法親自出席，我們為您安排專業代客服務，讓先人感受您的心意。'
        }
      </div>

      {/* Products */}
      <div className="products-grid section">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-emoji">{product.icon}</div>
            <div className="product-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div className="product-name">{product.name}</div>
                <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{product.tag}</span>
              </div>
              <div className="product-desc">{product.desc}</div>
              <div className="product-footer">
                <div className="product-price">NT$ {product.price.toLocaleString()}</div>
                <button
                  id={`btn-add-cart-${product.id}`}
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(product)}
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pickup date (attend only) */}
      {tab === 0 && (
        <div className="section card">
          <div className="card-body">
            <h3 style={{ marginBottom: 12, color: 'var(--gold-deep)' }}>📅 選擇取貨資訊</h3>
            <div className="form-group">
              <label className="form-label">取貨日期</label>
              <input type="date" className="form-input" defaultValue="2026-04-04" id="input-pickup-date" />
            </div>
            <div className="form-group">
              <label className="form-label">取貨地點</label>
              <select className="form-select" id="select-pickup-location">
                <option>台北市・大安店</option>
                <option>新北市・板橋店</option>
                <option>桃園市・中壢店</option>
                <option>台中市・西屯店</option>
                <option>高雄市・左營店</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Cart floating */}
      {cartCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 'calc(var(--nav-height) + 16px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)',
          maxWidth: 440,
          background: 'linear-gradient(135deg, var(--crimson), #6B1010)',
          borderRadius: 'var(--radius-full)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          boxShadow: '0 4px 20px rgba(100, 0, 0, 0.4)',
          zIndex: 90,
          animation: 'fadeIn 0.3s ease',
        }}>
          <div>
            <span style={{ fontWeight: 700 }}>🛒 {cartCount} 件商品</span>
            <span style={{ marginLeft: 12, color: 'var(--gold-light)', fontFamily: 'var(--font-serif)' }}>
              NT$ {cartTotal.toLocaleString()}
            </span>
          </div>
          <button id="btn-checkout" className="btn btn-primary btn-sm" onClick={() => showToast('結帳功能即將開放（串接綠界金流中）')}>
            前往結帳
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default RitualShop
