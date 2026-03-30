import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRoom } from '../contexts/RoomContext'

function MemorialWall({ user }) {
  const { roomId } = useRoom()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', message: '' })
  const [uploading, setUploading] = useState(false)
  const [animItem, setAnimItem] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    if (roomId) fetchPosts()
  }, [roomId])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('QingMing_memorial_posts')
      .select('*')
      .eq('family_room_id', roomId)
      .order('created_at', { ascending: false })
    
    if (data) setPosts(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    setUploading(true)

    let photoUrl = null
    const file = fileRef.current?.files[0]

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${roomId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('memorial_photos')
        .upload(filePath, file)
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('memorial_photos')
          .getPublicUrl(filePath)
        photoUrl = publicUrl
      }
    }

    const { error } = await supabase
      .from('QingMing_memorial_posts')
      .insert({
        family_room_id: roomId,
        user_id: user?.id,
        author_name: user?.user_metadata?.full_name || '家族成員',
        deceased_name: form.name,
        message: form.message,
        photo_url: photoUrl,
        ai_status: photoUrl ? 'pending' : 'none'
      })

    if (!error) {
      setForm({ name: '', message: '' })
      setShowForm(false)
      fetchPosts()
    }
    setUploading(false)
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
          {animItem.photo_url ? (
            <img src={animItem.photo_url} alt="" style={{
              width: 240, height: 240, borderRadius: '50%', objectFit: 'cover',
              border: '4px solid var(--gold)',
              animation: 'float 2s ease-in-out infinite'
            }} />
          ) : (
            <div style={{
              fontSize: '8rem',
              animation: 'float 2s ease-in-out infinite, pulse 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 30px rgba(200,150,12,0.5))',
            }}>🙏</div>
          )}
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--gold-light)', textAlign: 'center' }}>
            {animItem.deceased_name}
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
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>點擊任意處關閉</p>
        </div>
      )}

      <div className="page-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="text-serif" style={{ fontSize: '1.8rem', color: 'var(--color-warm-900)' }}>🕯️ 追思牆</h1>
        <p style={{ color: 'var(--color-warm-600)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>在此留下對先人的思念與祝福</p>
      </div>

      {/* Add post button */}
      <div className="section">
        <button
          id="btn-add-memorial"
          className="btn btn-primary btn-full"
          onClick={() => setShowForm(!showForm)}
          disabled={uploading}
        >
          {showForm ? '✕ 取消' : '✏️ 新增追思留言'}
        </button>
      </div>

      {/* Add form */}
      {(showForm || uploading) && (
        <div className="section card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-body">
            <h2 className="text-serif" style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--color-warm-800)' }}>✍️ 填寫追思</h2>
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
                  disabled={uploading}
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
                  disabled={uploading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">上傳照片（選填）</label>
                <div className="upload-area" onClick={() => !uploading && fileRef.current.click()}>
                  <div className="upload-icon">📸</div>
                  <div className="upload-text">{fileRef.current?.files?.[0]?.name || '點擊上傳先人照片'}</div>
                  <div className="upload-hint">支援 JPG、PNG，AI 動畫化需正面清晰照</div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} />
                </div>
              </div>
              <button id="btn-submit-memorial" type="submit" className="btn btn-primary btn-full" disabled={uploading}>
                {uploading ? '⌛ 處理中...' : '🌸 送出追思'}
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
            點擊追思照片，讓思念穿透影像
          </div>
        </div>
      </div>

      <div className="memorial-grid">
        {loading && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>載入中...</p>}
        {!loading && posts.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>尚無留言，成為第一個留下懷念的人吧 🙏</p>}
        {posts.map(post => (
          <div
            key={post.id}
            className="memorial-item"
            onClick={() => setAnimItem(post)}
            style={{ cursor: 'pointer' }}
          >
            <div className="memorial-img-wrap">
              {post.photo_url ? (
                <img src={post.photo_url} alt="" className="memorial-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="memorial-img-placeholder">
                  <span>🙏</span>
                </div>
              )}
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
            </div>
            <div className="memorial-caption">
              <div className="memorial-name">{post.deceased_name}</div>
              <div className="memorial-msg">{post.message}</div>
              <div className="memorial-date">🕐 {new Date(post.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemorialWall
