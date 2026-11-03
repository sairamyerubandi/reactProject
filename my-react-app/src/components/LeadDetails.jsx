import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLabel, LEAD_SOURCES, LEAD_STATUSES } from '../data/leads.js'
import { addLeadNote, clearSelectedLead, fetchLeadById } from '../store/leadsSlice.js'
import { formatDate, formatDateTime } from '../utils/format.js'

// Pop-up showing one lead with its notes, and a small form to add a new note.
function LeadDetails({ leadId, onClose }) {
  const dispatch = useDispatch()
  const lead = useSelector((state) => state.leads.selectedLead)
  const isLoading = useSelector((state) => state.leads.isDetailsLoading)
  const loadError = useSelector((state) => state.leads.detailsError)

  const [noteText, setNoteText] = useState('')
  const [noteError, setNoteError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Load the lead when the pop-up opens, and forget it when the pop-up closes
  useEffect(() => {
    dispatch(fetchLeadById(leadId))
    return () => {
      dispatch(clearSelectedLead())
    }
  }, [dispatch, leadId])

  async function handleAddNote(event) {
    event.preventDefault()
    if (!noteText.trim()) {
      setNoteError('Please write a note first.')
      return
    }
    setIsSaving(true)
    setNoteError('')
    try {
      await dispatch(addLeadNote({ leadId, body: noteText.trim() })).unwrap()
      setNoteText('')
    } catch (error) {
      setNoteError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation stops clicks inside the pop-up from closing it */}
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>{lead ? lead.name : 'Lead Details'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal__body">
          {isLoading && <p className="muted-text">Loading lead...</p>}
          {loadError && <p className="alert">{loadError}</p>}

          {lead && (
            <>
              <dl className="details-grid">
                <div><dt>Company</dt><dd>{lead.company || '-'}</dd></div>
                <div><dt>Email</dt><dd>{lead.email}</dd></div>
                <div><dt>Phone</dt><dd>{lead.phone || '-'}</dd></div>
                <div><dt>Source</dt><dd>{getLabel(LEAD_SOURCES, lead.source)}</dd></div>
                <div>
                  <dt>Status</dt>
                  <dd><span className={`badge badge--${lead.status}`}>{getLabel(LEAD_STATUSES, lead.status)}</span></dd>
                </div>
                <div><dt>Value</dt><dd>{lead.value.toLocaleString()}</dd></div>
                <div><dt>Created Date</dt><dd>{formatDate(lead.created_at)}</dd></div>
              </dl>

              <h3 className="notes-title">Notes ({lead.notes.length})</h3>

              <form className="note-form" onSubmit={handleAddNote} noValidate>
                <textarea
                  rows="2"
                  className={`input ${noteError ? 'input--error' : ''}`}
                  aria-label="New note"
                  placeholder="Write a note about this lead..."
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                />
                {noteError && <p className="form-field__error">{noteError}</p>}
                <button type="submit" className="btn btn--primary btn--small" disabled={isSaving}>
                  {isSaving ? 'Adding...' : 'Add Note'}
                </button>
              </form>

              {lead.notes.length === 0 ? (
                <p className="muted-text">No notes yet.</p>
              ) : (
                <ul className="notes-list">
                  {lead.notes.map((note) => (
                    <li key={note.id} className="note">
                      <p className="note__body">{note.body}</p>
                      <p className="note__date">{formatDateTime(note.created_at)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadDetails
