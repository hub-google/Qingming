import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import MemorialWall from './pages/MemorialWall'
import RitualShop from './pages/RitualShop'
import VirtualAltar from './pages/VirtualAltar'
import OrderTracking from './pages/OrderTracking'
import SpringOuting from './pages/SpringOuting'
import { supabase } from './lib/supabase'

import { RoomProvider } from './contexts/RoomContext'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loginRequired, setLoginRequired] = useState(false)

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        background: '#FFFBF0'
      }}>
        <div style={{ fontSize: '3rem', animation: 'float 2s ease-in-out infinite' }}>🌸</div>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>清明・家聚</p>
      </div>
    )
  }

  return (
    <BrowserRouter basename="/Qingming">
      <RoomProvider>
        <div className={user ? "mobile-container app-container" : "landing-container"}>
          <Routes>
            {/* Public Landing / Dashboard */}
            <Route path="/family/:roomId" element={<HomePage user={user} onLogin={() => setLoginRequired(true)} />} />
            <Route path="/" element={<HomePage user={user} onLogin={() => setLoginRequired(true)} />} />
            
            {/* Protected Routes */}
            <Route path="/memorial" element={user ? <MemorialWall user={user} /> : <Navigate to="/" replace />} />
            <Route path="/shop" element={user ? <RitualShop user={user} /> : <Navigate to="/" replace />} />
            <Route path="/altar" element={user ? <VirtualAltar user={user} /> : <Navigate to="/" replace />} />
            <Route path="/order" element={user ? <OrderTracking user={user} /> : <Navigate to="/" replace />} />
            <Route path="/spring" element={user ? <SpringOuting user={user} /> : <Navigate to="/" replace />} />
            <Route path="/login" element={<LoginPage onLogin={setUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {user && <BottomNav />}
          
          {/* Overlay Login if triggered from landing */}
          {!user && loginRequired && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                <button 
                  onClick={() => setLoginRequired(false)}
                  style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >✕</button>
                <LoginPage onLogin={(u) => { setUser(u); setLoginRequired(false); }} />
              </div>
            </div>
          )}
        </div>
      </RoomProvider>
    </BrowserRouter>
  )
}

export default App
