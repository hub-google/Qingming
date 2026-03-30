import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', icon: '🏠', label: '家族' },
  { path: '/memorial', icon: '🕯️', label: '追思' },
  { path: '/altar', icon: '🌸', label: '祭壇' },
  { path: '/shop', icon: '🛒', label: '商城' },
  { path: '/spring', icon: '🌿', label: '春遊' },
]

function BottomNav() {
  return (
    <nav className="bottom-nav" style={{ 
      background: 'rgba(253, 248, 246, 0.95)', 
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border)',
      boxShadow: '0 -4px 20px rgba(132, 99, 88, 0.08)'
    }}>
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-brand-dark)' : 'var(--color-warm-500)',
            transition: '0.2s',
            textDecoration: 'none'
          })}
        >
          <span className="nav-icon" style={{ fontSize: '1.4rem', marginBottom: '2px' }}>{item.icon}</span>
          <span className="nav-label" style={{ fontSize: '0.65rem', fontWeight: 700 }}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
