import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import App from './App.jsx'
import './index.css'

import { restoreSession } from './store/authSlice'

const token = localStorage.getItem('lagvoice_token');
const userStr = localStorage.getItem('lagvoice_user');
if (token && userStr) {
  try {
    const user = JSON.parse(userStr);
    store.dispatch(restoreSession({ user, token, role: user.role }));
  } catch (e) {
    localStorage.removeItem('lagvoice_token');
    localStorage.removeItem('lagvoice_user');
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
