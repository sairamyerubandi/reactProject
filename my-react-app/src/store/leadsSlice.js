import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { leadsApi } from '../api/leadsApi.js'

const PAGE_SIZE = 20
const RECENT_LEADS_COUNT = 5

// createAsyncThunk, but a failed request gives us a plain { message, details } object.
// Redux state and actions should only hold plain data, not Error objects.
function createApiThunk(type, callApi) {
  return createAsyncThunk(type, async (arg, thunkApi) => {
    try {
      return await callApi(arg, thunkApi)
    } catch (error) {
      return thunkApi.rejectWithValue({ message: error.message, details: error.details })
    }
  })
}

// ----- Reading data -----

// GET /api/leads using the search text, status filter, and page saved in the store
export const fetchLeads = createApiThunk('leads/fetchLeads', (_, { getState }) => {
  const { searchText, status, page } = getState().leads.filters
  const params = { page, limit: PAGE_SIZE }
  if (searchText.trim()) params.q = searchText.trim()
  if (status !== 'All') params.status = status
  return leadsApi.getAll(params)
})

// GET /api/leads, newest first, for the dashboard
export const fetchRecentLeads = createApiThunk('leads/fetchRecentLeads', async () => {
  const { data } = await leadsApi.getAll({ limit: RECENT_LEADS_COUNT, sort: '-created_at' })
  return data
})

// GET /api/leads/stats
export const fetchLeadStats = createApiThunk('leads/fetchLeadStats', () => leadsApi.getStats())

// GET /api/leads/:id (the lead and its notes)
export const fetchLeadById = createApiThunk('leads/fetchLeadById', (id) => leadsApi.getById(id))

// Reload everything that a create, update, or delete can change.
// The server does the filtering and paging, so it is the only one that knows the new lists.
function refreshLeads(dispatch) {
  dispatch(fetchLeads())
  dispatch(fetchRecentLeads())
  dispatch(fetchLeadStats())
}

// ----- Changing data -----

// POST /api/leads
export const createLead = createApiThunk('leads/createLead', async (lead, { dispatch }) => {
  const created = await leadsApi.create(lead)
  refreshLeads(dispatch)
  return created
})

// PATCH /api/leads/:id
export const updateLead = createApiThunk('leads/updateLead', async ({ id, changes }, { dispatch }) => {
  const updated = await leadsApi.update(id, changes)
  refreshLeads(dispatch)
  return updated
})

// DELETE /api/leads/:id
export const deleteLead = createApiThunk('leads/deleteLead', async (id, { dispatch }) => {
  await leadsApi.remove(id)
  refreshLeads(dispatch)
  return id
})

// POST /api/leads/:id/notes
export const addLeadNote = createApiThunk('leads/addLeadNote', ({ leadId, body }) => leadsApi.addNote(leadId, body))

// ----- The slice -----

const initialState = {
  // The "All Leads" table
  items: [],
  pagination: { page: 1, limit: PAGE_SIZE, total: 0, pages: 0 },
  filters: { searchText: '', status: 'All', page: 1 },
  isLoading: true,
  error: null,

  // The dashboard
  recentLeads: [],
  isRecentLoading: true,
  recentError: null,
  stats: null,
  statsError: null,

  // The lead opened in the details pop-up
  selectedLead: null,
  isDetailsLoading: false,
  detailsError: null,

  // The newest request of each kind. An older response that arrives late is ignored,
  // so a slow search can't overwrite the results of a newer one.
  latestRequests: {},
}

// Adds the pending/fulfilled/rejected cases for a thunk that loads data.
// Each handler only runs if its response belongs to the newest request of that kind.
function addLoadCases(builder, thunk, handlers) {
  const key = thunk.typePrefix
  const isLatest = (state, action) => state.latestRequests[key] === action.meta.requestId

  builder
    .addCase(thunk.pending, (state, action) => {
      state.latestRequests[key] = action.meta.requestId
      handlers.pending(state)
    })
    .addCase(thunk.fulfilled, (state, action) => {
      if (isLatest(state, action)) handlers.fulfilled(state, action)
    })
    .addCase(thunk.rejected, (state, action) => {
      if (isLatest(state, action)) handlers.rejected(state, action.payload.message)
    })
}

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    // A new search or filter can have fewer results, so go back to the first page
    setSearchText(state, action) {
      state.filters.searchText = action.payload
      state.filters.page = 1
    },
    setStatusFilter(state, action) {
      state.filters.status = action.payload
      state.filters.page = 1
    },
    setPage(state, action) {
      state.filters.page = action.payload
    },
    clearSelectedLead(state) {
      state.selectedLead = null
      state.isDetailsLoading = false
      state.detailsError = null
      delete state.latestRequests[fetchLeadById.typePrefix]
    },
  },
  extraReducers: (builder) => {
    addLoadCases(builder, fetchLeads, {
      pending: (state) => {
        state.isLoading = true
      },
      fulfilled: (state, action) => {
        state.isLoading = false
        state.error = null
        state.items = action.payload.data
        state.pagination = action.payload.pagination
        // Deleting the only lead on the last page leaves us past the end, so step back
        const lastPage = Math.max(action.payload.pagination.pages, 1)
        if (state.filters.page > lastPage) state.filters.page = lastPage
      },
      rejected: (state, message) => {
        state.isLoading = false
        state.error = message
      },
    })

    addLoadCases(builder, fetchRecentLeads, {
      pending: (state) => {
        state.isRecentLoading = true
      },
      fulfilled: (state, action) => {
        state.isRecentLoading = false
        state.recentError = null
        state.recentLeads = action.payload
      },
      rejected: (state, message) => {
        state.isRecentLoading = false
        state.recentError = message
      },
    })

    addLoadCases(builder, fetchLeadStats, {
      pending: () => {},
      fulfilled: (state, action) => {
        state.statsError = null
        state.stats = action.payload
      },
      rejected: (state, message) => {
        state.statsError = message
      },
    })

    addLoadCases(builder, fetchLeadById, {
      pending: (state) => {
        state.isDetailsLoading = true
        state.detailsError = null
        state.selectedLead = null
      },
      fulfilled: (state, action) => {
        state.isDetailsLoading = false
        state.selectedLead = action.payload
      },
      rejected: (state, message) => {
        state.isDetailsLoading = false
        state.detailsError = message
      },
    })

    // Show the new note straight away (the server lists notes newest first)
    builder.addCase(addLeadNote.fulfilled, (state, action) => {
      if (state.selectedLead?.id === action.payload.lead_id) {
        state.selectedLead.notes.unshift(action.payload)
      }
    })
  },
})

export const { setSearchText, setStatusFilter, setPage, clearSelectedLead } = leadsSlice.actions
export default leadsSlice.reducer
