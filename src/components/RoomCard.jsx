/* eslint-disable react-refresh/only-export-components */
import { useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { Wifi, Snowflake, Tv, Coffee, Bath, Martini, Laptop } from "lucide-react"

export const amenityConfig = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  ac: { icon: Snowflake, label: "A/C" },
  tv: { icon: Tv, label: "TV" },
  breakfast: { icon: Coffee, label: "Breakfast" },
  desk: { icon: Laptop, label: "Work desk" },
  private_bath: { icon: Bath, label: "bathroom" },
  bar: { icon: Martini, label: "Mini-Bar" },
}

// eslint-disable-next-line no-unused-vars
const AmenityIcon = ({ icon: Icon, label }) => {
  return (
    <div
      className="flex flex-col items-center gap-1 text-xs text-gray-700 w-20"
      role="img"
      aria-label={label}
      title={label}
    >
      <Icon className="w-5 h-5 text-amber-700" aria-hidden="true" />
      <span className="text-center leading-tight">{label}</span>
    </div>
  )
}


const AmenitiesGrid = ({ amenities }) => {
  const MAX_VISIBLE = 6
  const visible = amenities.slice(0, MAX_VISIBLE)
  const remaining = amenities.length - MAX_VISIBLE

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">
        Room amenities
      </h4>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {visible.map((key) => {
          const amenity = amenityConfig[key]
          if (!amenity) return null

          return (
            <AmenityIcon
              key={key}
              icon={amenity.icon}
              label={amenity.label}
            />
          )
        })}
      </div>

      {remaining > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          +{remaining} more amenities
        </p>
      )}
    </div>
  )
}


const RoomCard = ({ room, branchId, checkIn, checkOut }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleBookNow = async () => {
    if (!user) return
    setLoading(true)
    setError("")
    try {
      const { data } = await axios.post("/api/bookings", {
        branchId,
        roomTypeId: room.id,
        userId: user.sub,
        checkIn,
        checkOut,
      })
      alert(`Booking successful! Total: EGP ${data.newBooking.totalPrice}`)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={room.imgUrls?.[0]}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {room.name}
          </h2>
          <span className="text-sm text-gray-600">
            Up to {room.capacity} guests
          </span>
        </div>
        {/* Description */}
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            {room.description}
        </p>

        {/* Amenities */}
        <AmenitiesGrid amenities={room.amenities} />

        {/* Pricing */}
        <div className="mt-4 border-t pt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              {room.nights} night(s)
            </p>
            <p className="text-lg font-bold text-gray-900">
              EGP {room.totalPrice}
            </p>
          </div>

          <button
            onClick={handleBookNow}
            disabled={loading}
            className="bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition disabled:opacity-50"
          >
            {loading ? "Booking..." : "Book now"}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  )
}


export default RoomCard
