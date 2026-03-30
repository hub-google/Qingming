const SPRING_ITEMS = [
  {
    category: '🛡 旅遊保險',
    items: [
      {
        id: 1,
        icon: '🛡',
        title: '國泰旅平險・清明限定',
        desc: '清明掃墓途中意外保障，最高 300 萬理賠，一鍵投保 5 分鐘搞定。',
        tag: '推薦',
        affiliate: 'https://insurance.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=travel',
      },
      {
        id: 2,
        icon: '🏥',
        title: '全家醫療保障方案',
        desc: '特別設計給出席掃墓的家族成員，含意外與突發疾病保障。',
        tag: '家族首選',
        affiliate: 'https://insurance.example.com/family?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=family',
      },
    ]
  },
  {
    category: '🚗 租車服務',
    items: [
      {
        id: 3,
        icon: '🚙',
        title: 'iRent 清明特惠租車',
        desc: '家族出遊首選，7 人座 MPV 一日只要 NT$ 2,500，含清明免費升等。',
        tag: '限時折扣',
        affiliate: 'https://irent.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=car',
      },
      {
        id: 4,
        icon: '🚌',
        title: '葛瑪蘭・清明包車',
        desc: '10~20 人大家族掃墓包車，專屬司機導覽，安心又省事。',
        tag: '大家族',
        affiliate: 'https://bus.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=bus',
      },
    ]
  },
  {
    category: '🍽 家族餐廳',
    items: [
      {
        id: 5,
        icon: '🍜',
        title: '欣葉台菜・家族聚餐包廂',
        desc: '清明掃墓後家族聚餐首選，預訂清明特惠套餐享 9 折優惠。',
        tag: '限量訂位',
        affiliate: 'https://restaurant.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=restaurant',
      },
      {
        id: 6,
        icon: '🥢',
        title: '鼎泰豐・特別預訂通道',
        desc: '透過專屬連結享免排隊特殊預約席，清明節日限額 20 組。',
        tag: '免排隊',
        affiliate: 'https://dtf.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=dtf',
      },
    ]
  },
  {
    category: '🏨 春遊住宿',
    items: [
      {
        id: 7,
        icon: '🏨',
        title: '礁溪老爺・清明溫泉包',
        desc: '掃墓後帶著家人泡溫泉放鬆！清明夜晚 NT$ 3,888 起，含早餐。',
        tag: '春遊推薦',
        affiliate: 'https://hotel.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=hotel',
      },
    ]
  },
]

function SpringOuting() {
  const handleAffiliate = (url, title) => {
    // In prod: log click with UTM to analytics, then open
    console.log(`Affiliate click: ${title}`)
    window.open(url, '_blank')
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
      {SPRING_ITEMS.map((cat, ci) => (
        <div key={ci} className="section">
          <div className="section-title" style={{ marginBottom: 14 }}>{cat.category}</div>
          {cat.items.map(item => (
            <div
              key={item.id}
              id={`btn-spring-${item.id}`}
              className="spring-card"
              onClick={() => handleAffiliate(item.affiliate, item.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="spring-card-emoji">{item.icon}</div>
              <div className="spring-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div className="spring-card-title">{item.title}</div>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem', flexShrink: 0 }}>{item.tag}</span>
                </div>
                <div className="spring-card-desc">{item.desc}</div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            id="input-lead-name"
            className="form-input"
            placeholder="您的姓名"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          />
          <input
            id="input-lead-phone"
            className="form-input"
            placeholder="聯絡電話"
            type="tel"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          />
          <button id="btn-lead-submit" className="btn btn-primary">
            🏛 預約免費諮詢
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: 12 }}>
          您的資料將以加密方式保存，不會外洩給第三方
        </p>
      </div>
    </div>
  )
}

export default SpringOuting
