import { useEffect, useState } from "react"
import { axiosAuth } from "../../api/axiosAuth"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

const metricCard = (title, value, hint) => (
  <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
    <p className="text-sm text-amber-800">{title}</p>
    <p className="text-2xl font-bold text-amber-900 mt-1">{value}</p>
    {hint && <p className="text-xs text-amber-700 mt-1">{hint}</p>}
  </div>
)

const PIE_COLORS = ["#d97706", "#b45309", "#92400e", "#f59e0b", "#78350f"]

export function AdminDashboard() {
  const [metrics, setMetrics] = useState([])
  const [revenueSeries, setRevenueSeries] = useState([])
  const [branchBookings, setBranchBookings] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    const getMetrics = async () => {
      try {
        const { data } = await axiosAuth.get("/booking/metrics")
        if (!active) return

        const totalRooms = data.occupancyPerBranch.reduce((sum, b) => sum + b.totalRooms, 0)
        const occupiedRooms = data.occupancyPerBranch.reduce((sum, b) => sum + b.occupiedRooms, 0)
        const occupancyRate = `${Math.round((occupiedRooms / totalRooms) * 100)}%`
        const activeBranches = data.occupancyPerBranch.filter((b) => b.totalRooms > 0).length

        setMetrics([
          { title: "Total Revenue", value: `EGP ${data.totalRevenue}` },
          { title: "Revenue (This Month)", value: `EGP ${data.revenueThisMonth}` },
          { title: "Total Bookings", value: data.totalBookings },
          { title: "Occupancy Rate", value: occupancyRate, hint: "Booked nights / available nights" },
          { title: "Active Branches", value: activeBranches },
        ])

        setRevenueSeries(data.revenueOverTime)
        setBranchBookings(
          data.bookingsPerBranch.map((b, idx) => ({
            name: `${b.branchName} - ${b.branchLocation}`,
            value: b.bookings,
            color: PIE_COLORS[idx % PIE_COLORS.length],
          }))
        )
        setError("")
      } catch (err) {
        if (!active) return
        setError(err.response?.data?.message || err.message || "Failed to load metrics")
      }
    }
    getMetrics()
    return () => {
      active = false
    }
  }, [])

  const revenueData = revenueSeries.map((r) => ({
    name: r.label,
    value: Number(r.value),
  }))

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.title}>{metricCard(m.title, m.value, m.hint)}</div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-amber-900">Revenue Over Time</h3>
            <span className="text-xs text-amber-700">
              {revenueSeries.length ? "Live data" : "No data"}
            </span>
          </div>
          <div className="h-64">
            {revenueData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#92400e" }}
                    axisLine={{ stroke: "#92400e" }}
                    tickLine={{ stroke: "#92400e" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#92400e" }}
                    axisLine={{ stroke: "#92400e" }}
                    tickLine={{ stroke: "#92400e" }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#d97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-amber-800">No revenue data.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-amber-900">Bookings per Branch</h3>
            <span className="text-xs text-amber-700">
              {branchBookings.length ? "Live data" : "No data"}
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            {branchBookings.length ? (
              <PieChart width={320} height={260}>
                <Pie
                  data={branchBookings}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {branchBookings.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="left"
                  wrapperStyle={{ marginTop: 8 }}
                />
              </PieChart>
            ) : (
              <p className="text-sm text-amber-800">No branch bookings data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
