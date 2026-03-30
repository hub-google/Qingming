import { supabase } from '../lib/supabase'
import { useRoom } from '../contexts/RoomContext'

const TABS = ['親自出席', '無法出席']

function RitualShop({ user }) {
  const { roomId } = useRoom()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (user) fetchProducts()
  }, [user])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('QingMing_products')
      .select('*')
      .eq('is_active', true)
    
    if (data) setDbProducts(data)
    setLoading(false)
  }

  const categoryFilter = tab === 0 ? 'attend_bundle' : 'proxy_service'
  const products = dbProducts.filter(p => p.category === categoryFilter)

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

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setLoading(true)
    
    // 1. Create Order in Database
    const { data: orderData } = await supabase
      .from('QingMing_orders')
      .insert({
        user_id: user?.id,
        family_room_id: roomId,
        total_amount: cartTotal,
        payment_status: 'pending', // Initially pending
        pickup_info: tab === 0 ? { date: '2026-04-04', location: '台北市・大安店' } : null
      })
      .select('id')
      .single()

    if (orderData) {
      // 2. Create Order Items
      const items = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.qty,
        unit_price: item.price
      }))
      await supabase.from('QingMing_order_items').insert(items)

      // 3. Invoke ECPay Edge Function
      const { data: payData, error: payError } = await supabase.functions.invoke('ecpay-checkout', {
        body: { 
          orderId: orderData.id, 
          totalAmount: cartTotal,
          itemName: cart.map(i => i.name).join(', ')
        }
      })

      if (payData && payData.url) {
        setCart([])
        showToast('🚀 正在跳轉至綠界支付頁面...')
        
        // Create hidden form and submit
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = payData.url
        Object.keys(payData.params).forEach(key => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = payData.params[key]
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
      } else {
        console.error('Payment Error:', payError)
        showToast('❌ 支付系統暫時無法連線，請稍後再試。')
      }
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="text-serif" style={{ fontSize: '1.8rem', color: 'var(--color-warm-900)' }}>🛒 祭祀商城</h1>
        <p style={{ color: 'var(--color-warm-600)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>智慧分流・出席或代拜，一鍵搞定</p>
      </div>

      <div className="tab-group section">
        {TABS.map((t, i) => (
          <button
            key={i}
            className={`tab-btn${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
          >
            {i === 0 ? '✅ ' : '🙏 '}{t}
          </button>
        ))}
      </div>

      <div style={{
        background: tab === 0 ? 'rgba(67, 48, 43, 0.05)' : 'rgba(217, 119, 6, 0.05)',
        border: `1.5px solid ${tab === 0 ? 'var(--color-warm-800)' : 'var(--color-brand)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        marginBottom: 20,
        fontSize: '0.85rem',
        color: tab === 0 ? 'var(--color-warm-800)' : 'var(--color-brand-dark)',
        fontWeight: 500,
      }}>
        {tab === 0
          ? '🌿 您選擇親自出席，建議提前預購供品！可選擇取貨日期與地點。'
          : '🙏 您無法親自出席，我們為您安排專業代客服務，讓先人感受您的心意。'
        }
      </div>

      <div className="products-grid section">
        {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>載入中...</p>}
        {!loading && products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-emoji">{product.icon_emoji}</div>
            <div className="product-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div className="product-name">{product.name}</div>
                {product.tag && <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{product.tag}</span>}
              </div>
              <div className="product-desc">{product.description}</div>
              <div className="product-footer">
                <div className="product-price">NT$ {product.price.toLocaleString()}</div>
                <button
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

      {tab === 0 && (
        <div className="section card">
          <div className="card-body">
            <h3 style={{ marginBottom: 12, color: 'var(--gold-deep)' }}>📅 選擇取貨資訊</h3>
            <div className="form-group">
              <label className="form-label">取貨日期</label>
              <input type="date" className="form-input" defaultValue="2026-04-04" />
            </div>
            <div className="form-group">
              <label className="form-label">取貨地點</label>
              <select className="form-select">
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

      {cartCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 'calc(var(--nav-height) + 16px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)',
          maxWidth: 440,
          background: 'linear-gradient(135deg, var(--color-warm-800), #2c1a14)',
          borderRadius: 'var(--radius-full)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 90,
          animation: 'fadeIn 0.3s ease',
        }}>
          <div>
            <span style={{ fontWeight: 700 }}>🛒 {cartCount} 件商品</span>
            <span style={{ marginLeft: 12, color: 'var(--gold-light)', fontFamily: 'var(--font-serif)' }}>
              NT$ {cartTotal.toLocaleString()}
            </span>
          </div>
          <button className="btn btn-primary btn-sm" disabled={loading} onClick={handleCheckout}>
            {loading ? '⌛ 處理中...' : '前往結帳'}
          </button>
        </div>
      )}

      {/* ECPay Compliance Footer */}
      <div style={{
        marginTop: 40,
        padding: '20px',
        background: '#f9f9f9',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>📜 購物須知與退款政策</div>
        <ul style={{ paddingLeft: 20 }}>
          <li>本站商品均為祭祀與代客服務類。如需取消訂單，請於服務預定日前 3 天聯繫客服。</li>
          <li>代掃墓服務如因不可抗力因素（如颱風）無法執行，將全額退款或另約日期。</li>
          <li>實體商品（供品包）如已送出或拆封，因食品安全性考量，恕不接受退貨。</li>
          <li>所有交易爭議將依據中華民國法律處理。</li>
        </ul>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default RitualShop
