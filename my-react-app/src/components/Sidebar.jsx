// The menu items shown in the sidebar
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'leads', label: 'Leads', icon: '👥' },
]

// Left-hand navigation. On mobile it slides in when `isOpen` is true.
function Sidebar({ activePage, onNavigate, isOpen, onClose, onLogout }) {
  return (
    <>
      {/* Dark overlay behind the sidebar on mobile; clicking it closes the menu */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__logo">LF</span>
          <span>LeadFlow CRM</span>
        </div>

        <nav className="sidebar__nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar__link ${activePage === item.id ? 'sidebar__link--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="sidebar__link sidebar__logout" onClick={onLogout}>
          <span className="sidebar__icon">🚪</span>
          Log Out
        </button>

        <p className="sidebar__footer">Data is saved on the server</p>
      </aside>
    </>
  )
}

export default Sidebar
