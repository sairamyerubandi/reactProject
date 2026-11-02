import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import DashboardCards from './components/DashboardCards.jsx'
import LeadForm from './components/LeadForm.jsx'
import LeadTable from './components/LeadTable.jsx'
import SearchFilter from './components/SearchFilter.jsx'
import { SAMPLE_LEADS } from './data/leads.js'

// The key we use to save leads in the browser's localStorage
const STORAGE_KEY = 'lead-management-leads'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  leads: 'Lead Managements',
}

// Read saved leads from localStorage. The first time, use the sample leads.
function loadLeads() {
  try {
    const savedLeads = localStorage.getItem(STORAGE_KEY)
    return savedLeads ? JSON.parse(savedLeads) : SAMPLE_LEADS
  } catch {
    // If the saved data is broken, start with the sample leads instead of crashing
    return SAMPLE_LEADS
  }
}

function App() {
  // Passing a function to useState means loadLeads runs only once, on first render
  const [leads, setLeads] = useState(loadLeads)
  const [activePage, setActivePage] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Form state: isFormOpen shows the pop-up, editingLead is null when adding a new lead
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)

  // Every time the leads change, save them to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  }, [leads])

  function navigate(page) {
    setActivePage(page)
    setIsSidebarOpen(false)
  }

  function openAddForm() {
    setEditingLead(null)
    setIsFormOpen(true)
  }

  function openEditForm(lead) {
    setEditingLead(lead)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingLead(null)
  }

  function saveLead(leadData) {
    if (editingLead) {
      // Replace the old lead with the updated one
      setLeads((previousLeads) =>
        previousLeads.map((lead) => (lead.id === editingLead.id ? { ...leadData, id: lead.id } : lead)),
      )
    } else {
      // Put the new lead at the top of the list
      setLeads((previousLeads) => [{ ...leadData, id: crypto.randomUUID() }, ...previousLeads])
    }
    closeForm()
  }

  function deleteLead(lead) {
    if (window.confirm(`Are you sure you want to delete "${lead.name}"? This cannot be undone.`)) {
      setLeads((previousLeads) => previousLeads.filter((item) => item.id !== lead.id))
    }
  }

  // Apply the search text and status filter
  const search = searchText.trim().toLowerCase()
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.phone.toLowerCase().includes(search)
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Newest five leads for the dashboard
  const recentLeads = [...leads]
    .sort((a, b) => b.createdDate.localeCompare(a.createdDate))
    .slice(0, 5)

  return (
    <div className="layout">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main">
        <header className="topbar">
          <button className="topbar__menu" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            ☰
          </button>
          <h1 className="topbar__title">{PAGE_TITLES[activePage]}</h1>
          <button className="btn btn--primary" onClick={openAddForm}>
            + Add Lead
          </button>
        </header>

        <main className="content">
          {activePage === 'dashboard' && (
            <>
              <DashboardCards leads={leads} />
              <section className="panel">
                <div className="panel__header">
                  <h2>Recent Leads</h2>
                  <button className="btn btn--link" onClick={() => navigate('leads')}>
                    View all →
                  </button>
                </div>
                <LeadTable
                  leads={recentLeads}
                  showActions={false}
                  emptyMessage='No leads yet. Click "+ Add Lead" to create your first one.'
                />
              </section>
            </>
          )}

          {activePage === 'leads' && (
            <section className="panel">
              <div className="panel__header">
                <h2>All Leads ({filteredLeads.length})</h2>
              </div>
              <SearchFilter
                searchText={searchText}
                onSearchChange={setSearchText}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />
              <LeadTable
                leads={filteredLeads}
                onEdit={openEditForm}
                onDelete={deleteLead}
                emptyMessage={
                  leads.length === 0
                    ? 'No leads yet. Click "+ Add Lead" to create your first one.'
                    : 'No leads match your search or filter.'
                }
              />
            </section>
          )}
        </main>
      </div>

      {/* The key makes React start a fresh form each time a different lead is opened */}
      {isFormOpen && (
        <LeadForm key={editingLead ? editingLead.id : 'new'} lead={editingLead} onSave={saveLead} onCancel={closeForm} />
      )}
    </div>
  )
}

export default App
