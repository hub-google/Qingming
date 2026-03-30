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

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (!user) {
    return <LoginPage onLogin={setUser} />
  }

  return (
    <BrowserRouter basename="/Qingming">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/memorial" element={<MemorialWall user={user} />} />
          <Route path="/shop" element={<RitualShop user={user} />} />
          <Route path="/altar" element={<VirtualAltar user={user} />} />
          <Route path="/order" element={<OrderTracking />} />
          <Route path="/spring" element={<SpringOuting />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
