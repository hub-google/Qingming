import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const MOCK_POSTS = [
  {
    id: 1,
    name: '爺爺 陳清源',
    message: '您永遠在我們心中，謝謝您一生的付出。',
    date: '2026-04-03',
    emoji: '👴',
    hasAnim: true,
  },
  {
    id: 2,
    name: '奶奶 林月梅',
    message: '媽媽，想念您做的那碗米苔目。',
    date: '2026-04-03',
    emoji: '👵',
    hasAnim: false,
  },
  {
    id: 3,
    name: '外公 王德全',
    message: '外公，您的笑容是我永遠的驕傲。',
    date: '2026-04-02',
    emoji: '🧓',
    hasAnim: true,
  },
  {
    id: 4,
    name: '外婆 張秀英',
    message: '謝謝您教我做菜，每次下廚都想起您。',
    date: '2026-04-01',
    emoji: '👩‍🦳',
    hasAnim: false,
  },
]

function MemorialWall({ user }) {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', message: '' })
  const [animItem, setAnimItem] = useState(null)
  const fileRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    const newPost = {
      id: Date.now(),
      name: form.name,
      message: form.message,
      date: new Date().toISOString().slice(0, 10),
      emoji: ['👴', '👵', '🧓', '👩‍🦳', '🙏'][Math.floor(Math.random() * 5)],
      hasAnim: false,
    }
    setPosts(prev => [newPost, ...prev])
    setForm({ name: '', message: '' })
    setShowForm(false)
  }

  return (
    <div className="page">
      {/* AI Animation Overlay */}
      {animItem && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(20, 0, 0, 0.92)',
            zIndex: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            animation: 'fadeIn 0.4s ease',
          }}
          onClick={() => setAnimItem(null)}
        >
          <div style={{
            fontSize: '8rem',
            animation: 'float 2s ease-in-out infinite, pulse 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 30px rgba(200,150,12,0.5))',
          }}>{animItem.emoji}</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--gold-light)', textAlign: 'center' }}>
            {animItem.name}
          </div>
          <div style={{
            background: 'rgba(200,150,12,0.15)',
            border: '1px solid rgba(200,150,12,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 24px',
            maxWidth: 280,
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.8, fontStyle: 'italic' }}>
              「{animItem.message}」
            </p>
          </div>
          <div style={{
            background: 'rgba(45,122,79,0.2)',
            border: '1px solid rgba(45,122,79,0.4)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: '0.75rem', color: '#5AC880' }}>🤖 AI 動態模擬中</span>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#5AC880',
              animation: 'incenseGlow 1.5s ease-in-out infinite',
            }}/>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>點擊任意處關閉</p>
        </div>
      )}

      <div className="page-header">
        <h1>🕯️ 追思牆</h1>
        <p>在此留下對先人的思念與祝福</p>
      </div>

      {/* Add post button */}
      <div className="section">
        <button
          id="btn-add-memorial"
          className="btn btn-primary btn-full"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ 取消' : '✏️ 新增追思留言'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="section card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-body">
            <h2 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--crimson)' }}>✍️ 填寫追思</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">先人姓名</label>
                <input
                  id="input-memorial-name"
                  className="form-input"
                  placeholder="例：爺爺 陳清源"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">留言內容</label>
                <textarea
                  id="input-memorial-msg"
                  className="form-textarea"
                  placeholder="寫下您對先人的思念..."
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">上傳照片（選填）</label>
                <div className="upload-area" onClick={() => fileRef.current.click()}>
                  <div className="upload-icon">📸</div>
                  <div className="upload-text">點擊上傳先人照片</div>
                  <div className="upload-hint">支援 JPG、PNG，AI 動畫化需正面清晰照</div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} />
                </div>
              </div>
              <button id="btn-submit-memorial" type="submit" className="btn btn-crimson btn-full">
                🌸 送出追思
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI hint */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0A30, #0D0020)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
      }}>
        <span style={{ fontSize: '1.5rem' }}>🤖</span>
        <div>
          <div style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.9rem' }}>AI 照片動態化</div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', marginTop: 2 }}>
            點擊有 ✨ 標記的先人，體驗 AI 動態呈現
          </div>
        </div>
      </div>

      {/* Memorial grid */}
      <div className="memorial-grid">
        {posts.map(post => (
          <div
            key={post.id}
            className="memorial-item"
            onClick={() => post.hasAnim && setAnimItem(post)}
            style={{ cursor: post.hasAnim ? 'pointer' : 'default' }}
          >
            <div className="memorial-img-wrap">
              <div className="memorial-img-placeholder">
                <span style={{
                  animation: post.hasAnim ? 'float 3s ease-in-out infinite' : 'none',
                  display: 'block'
                }}>
                  {post.emoji}
                </span>
              </div>
              {post.hasAnim && (
                <div style={{
                  position: 'absolute',
                  top: 8, right: 8,
                  background: 'linear-gradient(135deg, #6B20C0, #3B10A0)',
                  color: 'white',
                  fontSize: '0.65rem',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                }}>✨ AI</div>
              )}
            </div>
            <div className="memorial-caption">
              <div className="memorial-name">{post.name}</div>
              <div className="memorial-msg">{post.message}</div>
              <div className="memorial-date">🕐 {post.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemorialWall
