// Previous/Next buttons under the table. Hidden when everything fits on one page.
function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  return (
    <div className="pagination">
      <button className="btn btn--small btn--secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ← Previous
      </button>
      <span className="pagination__info">Page {page} of {pages}</span>
      <button className="btn btn--small btn--secondary" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        Next →
      </button>
    </div>
  )
}

export default Pagination
