// Four summary cards. Counts are calculated from the leads list on every render,
// so they update automatically whenever a lead is added, edited, or deleted.
function DashboardCards({ leads }) {
  const countByStatus = (status) => leads.filter((lead) => lead.status === status).length

  const cards = [
    { label: 'Total Leads', value: leads.length, className: 'card--total', icon: '📋' },
    { label: 'New Leads', value: countByStatus('New'), className: 'card--new', icon: '✨' },
    { label: 'Contacted', value: countByStatus('Contacted'), className: 'card--contacted', icon: '📞' },
    { label: 'Converted', value: countByStatus('Converted'), className: 'card--converted', icon: '✅' },
  ]

  return (
    <div className="cards">
      {cards.map((card) => (
        <div key={card.label} className={`card ${card.className}`}>
          <div className="card__icon">{card.icon}</div>
          <div>
            <p className="card__label">{card.label}</p>
            <p className="card__value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards
