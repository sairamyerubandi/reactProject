import { LEAD_STATUSES } from '../data/leads.js'

// Search box + status dropdown. It only shows the values; the Redux store owns the state.
function SearchFilter({ searchText, onSearchChange, statusFilter, onStatusChange }) {
  return (
    <div className="search-filter">
      <input
        type="search"
        className="input search-filter__search"
        placeholder="Search by name, email, or company..."
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <select
        className="input search-filter__status"
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="All">All Statuses</option>
        {LEAD_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SearchFilter
