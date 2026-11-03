import { getLabel, LEAD_SOURCES, LEAD_STATUSES } from '../data/leads.js'
import { formatDate } from '../utils/format.js'

// Table of leads. Pass `showActions={false}` to hide the View/Edit/Delete buttons.
function LeadTable({ leads, onView, onEdit, onDelete, showActions = true, emptyMessage }) {
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
            <th>Value</th>
            <th>Created Date</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              {/* data-label is used by the CSS to show column names on mobile */}
              <td data-label="Lead Name" className="lead-table__name">{lead.name}</td>
              <td data-label="Company">{lead.company || '-'}</td>
              <td data-label="Email">{lead.email}</td>
              <td data-label="Phone">{lead.phone || '-'}</td>
              <td data-label="Source">{getLabel(LEAD_SOURCES, lead.source)}</td>
              <td data-label="Status">
                <span className={`badge badge--${lead.status}`}>{getLabel(LEAD_STATUSES, lead.status)}</span>
              </td>
              <td data-label="Value">{lead.value.toLocaleString()}</td>
              <td data-label="Created Date">{formatDate(lead.created_at)}</td>
              {showActions && (
                <td data-label="Actions">
                  <div className="lead-table__actions">
                    <button className="btn btn--small btn--secondary" onClick={() => onView(lead)}>
                      Viewsbfhvhj\sfg
                    </button>
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
