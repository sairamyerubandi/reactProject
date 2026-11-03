function Users({ stats }) {
  const countByStatus = (status) =>
    stats?.byStatus?.[status]?.count ?? '-'

  const cards = [
    {
      label: 'Total Leads',
      value: stats?.total ?? '-',
      className: 'card--total',
      icon: '📋',
    },
    {
      label: 'New Leads',
      value: countByStatus('New'),
      className: 'card--new',
      icon: '✨',
    },
    {
      label: 'Contacted',
      value: countByStatus('Contacted'),
      className: 'card--contacted',
      icon: '📞',
    },
    {
      label: 'Won',
      value: countByStatus('Won'),
      className: 'card--won',
      icon: '✅',
    },
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

export default Users