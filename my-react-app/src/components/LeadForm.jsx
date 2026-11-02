import { useState } from 'react'
import { LEAD_SOURCES, LEAD_STATUSES } from '../data/leads.js'

// Today's date in the YYYY-MM-DD format that <input type="date"> expects
function today() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

const EMPTY_LEAD = {
  name: '',
  company: '',
  email: '',
  phone: '',
  source: '',
  status: 'New',
  notes: '',
  createdDate: '',
}

// Check each field and return an object of error messages (empty object = valid)
function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Lead name is required.'
  if (!values.company.trim()) errors.company = 'Company name is required.'

  if (!values.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!/^\+?[\d\s()-]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.'
  }

  if (!values.source) errors.source = 'Please choose a lead source.'
  if (!values.status) errors.status = 'Please choose a lead status.'
  if (!values.createdDate) errors.createdDate = 'Created date is required.'
  return errors
}

// Pop-up form used for both adding and editing a lead.
// If `lead` is given we are editing; otherwise we are adding a new one.
function LeadForm({ lead, onSave, onCancel }) {
  const isEditing = Boolean(lead)
  const [values, setValues] = useState(lead || { ...EMPTY_LEAD, createdDate: today() })
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    // Clear the error for this field as soon as the user starts fixing it
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const foundErrors = validate(values)
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors)
      return
    }
    onSave({
      ...values,
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      notes: values.notes.trim(),
    })
  }

  // Small helper so every field renders its label and error the same way.
  // It is called as a plain function, Field({...}), not as <Field />, because a component
  // defined inside another component is re-created on each render and inputs would lose focus.
  function Field({ label, name, required, children }) {
    return (
      <div className={`form-field ${name === 'notes' ? 'form-field--full' : ''}`}>
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
        {children}
        {errors[name] && <p className="form-field__error">{errors[name]}</p>}
      </div>
    )
  }

  const inputClass = (name) => `input ${errors[name] ? 'input--error' : ''}`

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      {/* stopPropagation stops clicks inside the form from closing the modal */}
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>{isEditing ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button className="modal__close" onClick={onCancel} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {Field({
              label: 'Lead Name', name: 'name', required: true,
              children: <input id="name" name="name" className={inputClass('name')} value={values.name} onChange={handleChange} placeholder="e.g. Priya Sharma" />,
            })}
            {Field({
              label: 'Company Name', name: 'company', required: true,
              children: <input id="company" name="company" className={inputClass('company')} value={values.company} onChange={handleChange} placeholder="e.g. Nimbus Retail" />,
            })}
            {Field({
              label: 'Email Address', name: 'email', required: true,
              children: <input id="email" name="email" type="email" className={inputClass('email')} value={values.email} onChange={handleChange} placeholder="name@company.com" />,
            })}
            {Field({
              label: 'Phone Number', name: 'phone', required: true,
              children: <input id="phone" name="phone" type="tel" className={inputClass('phone')} value={values.phone} onChange={handleChange} placeholder="+91 98450 12345" />,
            })}
            {Field({
              label: 'Lead Source', name: 'source', required: true,
              children: (
                <select id="source" name="source" className={inputClass('source')} value={values.source} onChange={handleChange}>
                  <option value="">Select source</option>
                  {LEAD_SOURCES.map((source) => <option key={source} value={source}>{source}</option>)}
                </select>
              ),
            })}
            {Field({
              label: 'Lead Status', name: 'status', required: true,
              children: (
                <select id="status" name="status" className={inputClass('status')} value={values.status} onChange={handleChange}>
                  {LEAD_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              ),
            })}
            {Field({
              label: 'Created Date', name: 'createdDate', required: true,
              children: <input id="createdDate" name="createdDate" type="date" className={inputClass('createdDate')} value={values.createdDate} onChange={handleChange} />,
            })}
            {Field({
              label: 'Notes', name: 'notes',
              children: <textarea id="notes" name="notes" rows="3" className="input" value={values.notes} onChange={handleChange} placeholder="Any extra details about this lead..." />,
            })}
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn--primary">{isEditing ? 'Save Changes' : 'Add Lead'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadForm
