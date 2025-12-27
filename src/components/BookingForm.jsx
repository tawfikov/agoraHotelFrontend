 
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useLocation, Navigate } from "react-router-dom"
import { useBranches } from "../context/BranchesContext"
import { axiosAuth } from "../api/axiosAuth"
import RoomCard from "./RoomCard"
import { FaUser, FaHotel, FaCalendarAlt } from "react-icons/fa"
import PageLoader from "./PageLoader"

const DAY = 1000*3600*24

const dateFormat = (date) => {
    return date.toISOString().split('T')[0]
}

const dateSetter = (dateStr, days) => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return dateFormat(d)
}

export const BookingForm = () => {
    const today = new Date()
    const [checkIn, setCheckIn] = useState(() => dateFormat(new Date(today.getTime() + 3 * DAY)))
    const [checkOut, setCheckOut] = useState(() => dateFormat(new Date(today.getTime() + 5 * DAY)))
    const [guests, setGuests] = useState("")
    const [branchId, setBranchId] = useState("")
    const [loading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [rooms, setRooms] = useState([])
    const [hasSearched, setHasSearched] = useState(false)
    const { branches } = useBranches()
    const { user, authLoading } = useAuth()
    const location = useLocation()

    useEffect(() => {
        if (checkOut <= checkIn) {
            setCheckOut(dateSetter(checkIn, 1))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [checkIn])

    if (authLoading) {
      return <PageLoader />
    }

    if (!user) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }
    
    const handleBookingSearch = async (e) => {
        e.preventDefault()
        setHasSearched(true)
        if (!branchId || !checkIn || !checkOut || !guests) {
            setErrMsg("All fields are required")
            return
        }
        setErrMsg("")
        setLoading(true)

        try {
      // search rooms that satisfy guests & branch
        const { data } = await axiosAuth.post("/booking/search", {
            branchId: Number(branchId),
            guests: Number(guests),
            })

      // for each room type, fetch quote (price)
        const roomsWithPrice = await Promise.all(
        data.searchResults.map(async (roomType) => {
          const { data: quote } = await axiosAuth.post("/booking/quote", {
            branchId: Number(branchId),
            roomTypeId: roomType.id,
            checkIn,
            checkOut,
          })
          return { ...roomType, ...quote }
        })
      )

        setRooms(roomsWithPrice)
    } catch (err) {
        console.error(err)
        console.error(err.response?.data?.message)
        setErrMsg(err.response?.data?.message || "Failed to fetch rooms")
    } finally {
        setLoading(false)
        }
    }

  return (
    <>
      {/* Booking Form */}
      <div className="shadow-md rounded-lg p-6 my-6 border border-black max-w-4xl mx-auto bg-amber-50">
        {errMsg && (
          <div className="text-red-600 text-center font-bold bg-amber-100 rounded-2xl p-2 mb-4">
            {errMsg}
          </div>
        )}

        <form
          className="flex flex-wrap gap-4 items-end"
          onSubmit={handleBookingSearch}
        >
          {/* Hotel Selector */}
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm font-semibold mb-1 flex items-center gap-1">
              <FaHotel /> Hotel
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(Number(e.target.value))}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" disabled>
                Select a hotel
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} - {b.location}
                </option>
              ))}
            </select>
          </div>

          {/* Check-in */}
          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-semibold mb-1 flex items-center gap-1">
              <FaCalendarAlt /> Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              min={dateSetter(today, 1)}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Check-out */}
          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-semibold mb-1 flex items-center gap-1">
              <FaCalendarAlt /> Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              min={dateSetter(checkIn, 1)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Guests */}
          <div className="flex-1 min-w-20">
            <label className="text-sm font-semibold mb-1 flex items-center gap-1">
              <FaUser /> Guests
            </label>
            <input
              type="number"
              value={guests}
              min={1}
              max={4}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-amber-700 text-white py-2 px-4 rounded-md hover:bg-amber-800 transition"
            >
              {loading ? "Searching..." : "Book now!"}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      <div className="max-w-6xl mx-auto p-6 bg-amber-50 rounded-lg shadow-md">
        {hasSearched? (rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                branchId={branchId}
                checkIn={checkIn}
                checkOut={checkOut}
              />
            ))}
          </div>
        ) : (
           <p className="text-center text-gray-600">No rooms found</p>
            )
        ) : (
            null
        )}
      </div>
    </>
  )
}
