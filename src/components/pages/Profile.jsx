import { useEffect, useState } from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { axiosAuth } from "../../api/axiosAuth"
import PageLoader from "../PageLoader"

const formatDate = (dateStr) => {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const Profile = () => {
  const { user, authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (!user) return
    let active = true
    const fetchBookings = async () => {
      setLoading(true)
      setError("")
      try {
        const { data } = await axiosAuth.get("/booking/history")
        if (!active) return
        setBookings(data.bookings || [])
      } catch (err) {
        if (!active) return
        console.error(err)
        setError(err.response?.data?.message || "Failed to load bookings")
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchBookings()
    return () => {
      active = false
    }
  }, [user])

  if (authLoading) {
    return <PageLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/profile" }} />
  }

  const status = searchParams.get("status")
  const banner =
    status === "success"
      ? { text: "Payment successful! Your booking is confirmed.", tone: "success" }
      : status === "cancelled"
      ? { text: "Payment was cancelled. You can retry booking anytime.", tone: "warn" }
      : null

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-amber-900 mb-2">Profile</h1>
        <p className="text-gray-700">
          Welcome back, <span className="font-semibold">{user.name}</span>
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="font-semibold text-amber-900">Name</p>
            <p>{user.name || "—"}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="font-semibold text-amber-900">Email</p>
            <p>{user.email || "—"}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="font-semibold text-amber-900">Phone</p>
            <p>{user.phone || "—"}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="font-semibold text-amber-900">Username</p>
            <p>{user.username || user.name || "—"}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="font-semibold text-amber-900">Member since</p>
            <p>{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-900">Booking History</h2>
          {loading && <span className="text-sm text-gray-600">Loading...</span>}
        </div>
        {banner && (
          <div
            className={
              banner.tone === "success"
                ? "mb-4 rounded-lg border border-green-200 bg-green-50 text-green-800 p-3"
                : "mb-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 p-3"
            }
          >
            {banner.text}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 bg-amber-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}
        {bookings.length === 0 && !loading ? (
          <p className="text-gray-600">No bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <div
                key={b.id || `${b.branchId}-${b.checkIn}-${b.checkOut}`}
                className="border border-dashed border-amber-200 rounded-xl p-4 bg-amber-50 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-700">
                      {b.room?.branch?.name || b.branchName || "Branch"} - {b.room?.branch?.location || b.branchLocation || ""}
                    </p>
                    <p className="text-lg font-semibold text-amber-900">
                      Room {b.room?.number ?? b.roomNumber ?? ""} - {b.room?.roomType?.name || b.roomTypeName || "Room"}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white border border-amber-200 text-amber-800">
                    {b.status || "Booked"}
                  </span>
                </div>
                <div className="text-sm text-gray-800 space-y-1">
                  <p>
                    Check-in: <span className="font-semibold">{formatDate(b.checkIn)}</span>
                  </p>
                  <p>
                    Check-out: <span className="font-semibold">{formatDate(b.checkOut)}</span>
                  </p>
                  <p>
                    Total: <span className="font-semibold">EGP {b.totalPrice ?? b.total ?? "—"}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Placed on {formatDate(b.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
