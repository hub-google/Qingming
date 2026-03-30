import React from 'react'

const LandingPage = ({ onLogin }) => {
  return (
    <div className="landing-page" style={{ background: 'var(--color-warm-50)' }}>
      {/* Navigation */}
      <nav className="nav-glass" style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        height: '64px', display: 'flex', alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🌿</span>
            <span className="text-serif" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-warm-800)', letterSpacing: '0.05em' }}>
              清明・家聚
            </span>
          </div>
          <button 
            onClick={onLogin}
            style={{
              padding: '8px 20px', borderRadius: '999px',
              border: '1.5px solid var(--color-warm-300)',
              background: 'white', color: 'var(--color-warm-700)',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
            }}
          >
            登入 / 註冊
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-bg" style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px',
          background: 'rgba(245, 158, 11, 0.15)', filter: 'blur(80px)', borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%', width: '350px', height: '350px',
          background: 'rgba(161, 128, 114, 0.15)', filter: 'blur(100px)', borderRadius: '50%'
        }}></div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <h1 className="text-serif" style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: 'var(--color-warm-900)',
            lineHeight: 1.2, margin: '0 0 24px'
          }}>
            讓思念沒有距離<br />今年清明，我們<span className="text-brand-dark" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>「雲端家聚」</span>
          </h1>
          <p style={{
            fontSize: '1.1rem', color: 'var(--color-warm-600)', lineHeight: 1.7,
            maxWidth: '650px', margin: '0 auto 40px'
          }}>
            結合傳統敬意與現代科技，為您打理掃墓大小事。<br className="hidden-mobile" />
            一鍵建立專屬家族追思空間，無論身在何處，都能為先人獻上<span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>最深的心意。</span>
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={onLogin}
              className="btn btn-primary btn-lg"
              style={{ boxShadow: '0 10px 25px rgba(217, 119, 6, 0.25)' }}
            >
              免費建立專屬家族房間 →
            </button>
            <button 
              className="btn btn-outline btn-lg"
              style={{ background: 'white', borderColor: 'var(--color-warm-300)' }}
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              了解平台運作方式
            </button>
          </div>
          <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--color-warm-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            📱 免下載 App，LINE 一鍵邀請
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="text-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warm-800)', marginBottom: '16px' }}>
              把繁瑣交給我們，把時間留給家人
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-warm-600)', maxWidth: '700px', margin: '0 auto' }}>
              傳統清明節總是伴隨塞車、聯絡不易與採買繁瑣？今年，您有更好的選擇。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            {/* Feature 1 */}
            <div className="card" style={{ padding: '32px', background: 'var(--color-warm-50)', border: '1px solid var(--color-warm-100)' }}>
              <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>👥</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warm-800)', marginBottom: '12px' }}>
                一鍵統籌，告別群組洗版
              </h3>
              <p style={{ color: 'var(--color-warm-600)', lineHeight: 1.6 }}>
                不再為了統計人數傷透腦筋。發送專屬連結，親戚出席意願、掃墓分工一目了然，輕鬆搞定家族大小事。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '32px', background: 'var(--color-warm-50)', border: '1px solid var(--color-warm-100)' }}>
              <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>📸</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warm-800)', marginBottom: '12px' }}>
                尊榮代客，如同親臨現場
              </h3>
              <p style={{ color: 'var(--color-warm-600)', lineHeight: 1.6 }}>
                人在海外或抽不開身？我們提供高標準的代客掃墓服務。附帶 GPS 定位與全程縮時錄影，讓孝心精準送達。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '32px', background: 'var(--color-warm-50)', border: '1px solid var(--color-warm-100)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--color-brand-light)', color: 'var(--color-brand-dark)', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderBottomLeftRadius: '12px' }}>ESG 公益</div>
              <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>🎋</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warm-800)', marginBottom: '12px' }}>
                雲端福澤，化思念為大愛
              </h3>
              <p style={{ color: 'var(--color-warm-600)', lineHeight: 1.6 }}>
                線上為先人點燈、獻茶。您在平台的每一筆「雲端福澤金」，我們將提撥 10% 捐贈弱勢兒童，累積真實福報。
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: '32px', background: 'var(--color-warm-50)', border: '1px solid var(--color-warm-100)' }}>
              <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>🚗</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warm-800)', marginBottom: '12px' }}>
                春遊踏青，延續家族溫度
              </h3>
              <p style={{ color: 'var(--color-warm-600)', lineHeight: 1.6 }}>
                清明不只是祭祀。我們精選連假包車、景觀餐廳與寵物照護，一站式預約，讓春遊留下美好回憶。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section style={{ padding: '100px 24px', background: 'var(--color-warm-100)', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '80px' }}>
            {/* Text Area */}
            <div style={{ flex: '1 1 450px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '99px', background: 'white', color: 'var(--color-brand-dark)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                ✨ 獨家 AI 溫馨重現技術
              </div>
              <h2 className="text-serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-warm-800)', marginBottom: '24px', lineHeight: 1.2 }}>
                專屬線上追思牆，<br />喚醒最溫暖的回憶
              </h2>
              <blockquote style={{ fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--color-warm-600)', borderLeft: '4px solid var(--color-brand)', paddingLeft: '20px', margin: '0 0 32px' }}>
                「還記得爺爺溫暖的笑容嗎？」
              </blockquote>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-warm-700)', lineHeight: 1.8, marginBottom: '32px' }}>
                上傳珍貴的舊照片，透過獨家 AI 技術，讓照片中的先人重現和藹的微笑。在專屬的家族留言板上，寫下平時說不出口的思念，讓跨越世代的愛，在這裡永恆典藏。
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-warm-800)', fontWeight: 500 }}>
                  <span style={{ color: 'var(--color-brand)' }}>✓</span> 支援舊照片修復與微動態處理
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-warm-800)', fontWeight: 500 }}>
                  <span style={{ color: 'var(--color-brand)' }}>✓</span> 私密家族留言板，外人無法觀看
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-warm-800)', fontWeight: 500 }}>
                  <span style={{ color: 'var(--color-brand)' }}>✓</span> 可隨時隨地上傳手機中的回憶照片
                </div>
              </div>
            </div>

            {/* Mockup Area */}
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', width: '120%', height: '120%', background: 'rgba(245, 158, 11, 0.1)', filter: 'blur(80px)', top: '-10%', left: '-10%', borderRadius: '50%' }}></div>
              <div className="mockup-shadow" style={{
                width: '300px', height: '600px', background: 'white', borderRadius: '40px',
                border: '8px solid var(--color-warm-800)', overflow: 'hidden', position: 'relative',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ height: '64px', background: 'var(--color-warm-800)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 600 }}>
                  李家專屬追思空間
                </div>
                <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
                  <div style={{ width: '100%', height: '180px', background: '#ddd', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden', position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1544383835-bca2bc6f5ea3?auto=format&fit=crop&q=80&w=400&h=300" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px' }}>
                      ▶ AI 微笑播放中
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
                      <div style={{ fontSize: '0.65rem', color: '#999', marginBottom: '4px' }}>大伯父 (台北)</div>
                      <div style={{ fontSize: '0.8rem', color: '#333' }}>爸，今年大家都平安，您的孫子考上大學了，特地來跟您報告。</div>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
                      <div style={{ fontSize: '0.65rem', color: '#999', marginBottom: '4px' }}>小姑姑 (美國)</div>
                      <div style={{ fontSize: '0.8rem', color: '#333' }}>雖然今年無法回台，但在線上為您點了您最愛的烏龍茶，想您了。</div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, height: '40px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>💬 寫留言</div>
                    <div style={{ flex: 1, height: '40px', background: 'var(--color-brand)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>🎁 獻福澤</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '120px 24px', background: 'var(--color-warm-800)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'rgba(245, 158, 11, 0.1)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 className="text-serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '32px', lineHeight: 1.4 }}>
            時代在變，<br />慎終追遠的心意從未改變
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-warm-200)', lineHeight: 1.8, marginBottom: '48px', fontWeight: 300 }}>
            從一束鮮花到一份福報，從一句留言到一趟春遊，<br />
            「清明・家聚」陪您圓滿每一個傳承的時刻
          </p>
          <button 
            onClick={onLogin}
            className="btn btn-primary btn-lg"
            style={{ padding: '24px 48px', fontSize: '1.25rem', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' }}
          >
            立即發起今年的家族清明聚會 →
          </button>
          <p style={{ marginTop: '24px', color: 'var(--color-warm-300)', fontSize: '0.9rem' }}>
            已有超過 <span style={{ color: 'var(--color-brand-light)', fontSize: '1.1rem', fontWeight: 700 }}>1,200</span> 個家族在這裡溫馨相聚
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', background: 'var(--color-warm-900)', textAlign: 'center', color: '#666', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p>&copy; 2026 清明・家聚 家族整合平台. All rights reserved.</p>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <span style={{ cursor: 'pointer' }}>隱私權政策</span>
          <span style={{ cursor: 'pointer' }}>服務條款</span>
          <span style={{ cursor: 'pointer' }}>聯絡我們</span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
