import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import AuthGate from './AuthGate.jsx'
import { store } from './store/store.js'

// Find the <div id="root"> in index.html and render our app inside it.
// Provider gives every component access to the Redux store.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthGate />
    </Provider>
  </StrictMode>,
)
