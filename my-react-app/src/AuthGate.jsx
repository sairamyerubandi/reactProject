import { useSelector } from 'react-redux'
import App from './App.jsx'
import LoginScreen from './pages/loginScreen.jsx'

// Shows the login page until the user logs in. App is only rendered after that,
// so the dashboard, the sidebar, and their data requests all wait for the login.
function AuthGate() {
  const phone = useSelector((state) => state.auth.phone)
  return phone ? <App /> : <LoginScreen />
}

export default AuthGate
