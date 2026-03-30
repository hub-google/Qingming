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
    <nav className="bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
