import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/pages/Home.jsx'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import './index.css'
import { BranchProvider } from './context/BranchesContext.jsx'
import { BranchDetails } from './components/pages/BranchDetails.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Login } from './components/pages/Login.jsx'
import { Signup } from './components/pages/Signup.jsx'
import { BookingForm } from './components/BookingForm.jsx'
import { AuthGate } from './components/AuthGate.jsx'
import { Profile } from './components/pages/Profile.jsx'
import { AdminGuard } from './components/admin/AdminGuard.jsx'
import { AdminLayout } from './components/admin/AdminLayout.jsx'
import { AdminDashboard } from './components/admin/AdminDashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Home />},
      {path: '/branches/:branchId', element: <BranchDetails />},
      {path: '/login', element: <Login />},
      {path: '/signup', element: <Signup />},
      {path: '/booking', element: <BookingForm />},
      {path: '/profile', element: <Profile />}
    ]
  },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AuthGate>
      <BranchProvider>
        <RouterProvider router={router} />
      </BranchProvider>
    </AuthGate>
  </AuthProvider>
)
