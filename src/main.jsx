import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/Home.jsx'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import './index.css'
import { BranchProvider } from './components/context/BranchesContext.jsx'
import { BranchDetails } from './components/features/BranchDetails.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Home />},
      {path: '/branches/:branchId', element: <BranchDetails />}
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BranchProvider>
      <RouterProvider router={router} />
    </BranchProvider>
    
  </StrictMode>,
)
