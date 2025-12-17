import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/Home.jsx'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import './index.css'
import { BranchProvider } from './context/BranchesContext.jsx'
import { BranchDetails } from './components/features/BranchDetails.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Login } from './components/Login.jsx'
import { Signup } from './components/Signup.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Home />},
      {path: '/branches/:branchId', element: <BranchDetails />},
      {path: '/login', element: <Login />},
      {path: '/signup', element: <Signup />}
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BranchProvider>
      <RouterProvider router={router} />
    </BranchProvider>
  </AuthProvider>
)
