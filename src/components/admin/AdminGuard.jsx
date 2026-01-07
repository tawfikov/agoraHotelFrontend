import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import PageLoader from "../PageLoader"

export const AdminGuard = ({ children }) => {
  const { user, authLoading } = useAuth()

  if (authLoading) return <PageLoader />

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />
  }

  return children
}
