// Turns "2026-10-25" into "25 Oct 2026"
function formatDate(dateText) {
  if (!dateText) return '-'
  return new Date(dateText + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Table of leads. Pass `showActions={false}` to hide the Edit/Delete buttons.
function LeadTable({ leads, onEdit, onDelete, showActions = true, emptyMessage }) {
  if (leads.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__icon">🗂️</p>
        <p>{emptyMessage || 'No leads found.'}</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Status</th>
            <th>Created Date</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              {/* data-label is used by the CSS to show column names on mobile */}
              <td data-label="Lead Name" className="lead-table__name">{lead.name}</td>
              <td data-label="Company">{lead.company}</td>
              <td data-label="Email">{lead.email}</td>
              <td data-label="Phone">{lead.phone}</td>
              <td data-label="Source">{lead.source}</td>
              <td data-label="Status">
                <span className={`badge badge--${lead.status.toLowerCase()}`}>{lead.status}</span>
              </td>
              <td data-label="Created Date">{formatDate(lead.createdDate)}</td>
              {showActions && (
                <td data-label="Actions">
                  <div className="lead-table__actions">
                    <button className="btn btn--small btn--secondary" onClick={() => onEdit(lead)}>
                      Edit
                    </button>
                    <button className="btn btn--small btn--danger" onClick={() => onDelete(lead)}>
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeadTable
