import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from './components/Sidebar.jsx'
import DashboardCards from './components/DashboardCards.jsx'
import LeadDetails from './components/LeadDetails.jsx'
import LeadForm from './components/LeadForm.jsx'
import LeadTable from './components/LeadTable.jsx'
import Pagination from './components/Pagination.jsx'
import SearchFilter from './components/SearchFilter.jsx'
import { logOut } from './store/authSlice.js'
import {
  createLead,
  deleteLead,
  fetchLeads,
  fetchLeadStats,
  fetchRecentLeads,
  setPage,
  setSearchText,
  setStatusFilter,
  updateLead,
} from './store/leadsSlice.js'
import Users from './components/usersScreen.jsx'
// import Users from './components/usersScreen.js'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  leads: 'Lead Managements',
  users:'user management'
}

// Wait this long after the last change before asking the server, so that
// typing in the search box doesn't send one request per letter
const SEARCH_DELAY_MS = 300

function App() {
  const dispatch = useDispatch()
  const {
    items: leads,
    pagination,
    filters,
    isLoading,
    error,
    recentLeads,
    isRecentLoading,
    recentError,
    stats,
    statsError,
  } = useSelector((state) => state.leads)

  const [activePage, setActivePage] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Form state: isFormOpen shows the pop-up, editingLead is null when adding a new lead
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)

  // The id of the lead shown in the details pop-up (null when it is closed)
  const [viewingLeadId, setViewingLeadId] = useState(null)

  // Load the dashboard data once when the app opens
  useEffect(() => {
    dispatch(fetchLeadStats())
    dispatch(fetchRecentLeads())
  }, [dispatch])

  // Load the leads table on open, and again whenever the search, filter, or page changes
  useEffect(() => {
    const timer = setTimeout(() => dispatch(fetchLeads()), SEARCH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [dispatch, filters.searchText, filters.status, filters.page])

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

  // unwrap() makes a failed request throw, so the form can show the error and stay open
  async function saveLead(leadData) {
    if (editingLead) {
      await dispatch(updateLead({ id: editingLead.id, changes: leadData })).unwrap()
    } else {
      await dispatch(createLead(leadData)).unwrap()
    }
    closeForm()
  }

  async function removeLead(lead) {
    if (!window.confirm(`Are you sure you want to delete "${lead.name}"? This cannot be undone.`)) return
    try {
      await dispatch(deleteLead(lead.id)).unwrap()
    } catch (deleteError) {
      window.alert(`Could not delete "${lead.name}". ${deleteError.message}`)
    }
  }

  function getLeadsEmptyMessage() {
    if (isLoading) return 'Loading leads...'
    if (error) return 'Leads could not be loaded.'
    if (filters.searchText.trim() || filters.status !== 'All') return 'No leads match your search or filter.'
    return 'No leads yet. Click "+ Add Lead" to create your first one.'
  }

  function getRecentEmptyMessage() {
    if (isRecentLoading) return 'Loading leads...'
    if (recentError) return 'Leads could not be loaded.'
    return 'No leads yet. Click "+ Add Lead" to create your first one.'
  }

  const dashboardError = statsError || recentError

  return (
    <div className="layout">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => dispatch(logOut())}
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
              {dashboardError && (
                <div className="alert">
                  <span>{dashboardError}</span>
                  <button
                    className="btn btn--small btn--danger"
                    onClick={() => {
                      dispatch(fetchLeadStats())
                      dispatch(fetchRecentLeads())
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
              <DashboardCards stats={stats} />
              <section className="panel">
                <div className="panel__header">
                  <h2>Recent Leads</h2>
                  <button className="btn btn--link" onClick={() => navigate('leads')}>
                    View all →
                  </button>
                </div>
                <LeadTable leads={recentLeads} showActions={false} emptyMessage={getRecentEmptyMessage()} />
              </section>
            </>
          )}
          {activePage==='users' && (
            <div>
              <Users stats={stats}/>
              {/* <P>Sairam Yerubandi</P> */}
            </div>
          )}

          {activePage === 'leads' && (
            <section className="panel">
              <div className="panel__header">
                <h2>All Leads ({pagination.total})</h2>
              </div>
              <SearchFilter
                searchText={filters.searchText}
                onSearchChange={(text) => dispatch(setSearchText(text))}
                statusFilter={filters.status}
                onStatusChange={(status) => dispatch(setStatusFilter(status))}
              />
              {error && (
                <div className="alert alert--panel">
                  <span>{error}</span>
                  <button className="btn btn--small btn--danger" onClick={() => dispatch(fetchLeads())}>
                    Retry
                  </button>
                </div>
              )}
              <LeadTable
                leads={leads}
                onView={(lead) => setViewingLeadId(lead.id)}
                onEdit={openEditForm}
                onDelete={removeLead}
                emptyMessage={getLeadsEmptyMessage()}
              />
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={(page) => dispatch(setPage(page))}
              />
            </section>
          )}
        </main>
      </div>

      {/* The key makes React start a fresh form each time a different lead is opened */}
      {isFormOpen && (
        <LeadForm key={editingLead ? editingLead.id : 'new'} lead={editingLead} onSave={saveLead} onCancel={closeForm} />
      )}

      {viewingLeadId !== null && <LeadDetails leadId={viewingLeadId} onClose={() => setViewingLeadId(null)} />}
    </div>
  )
}

export default App
