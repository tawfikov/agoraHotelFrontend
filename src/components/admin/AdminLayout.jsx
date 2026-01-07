import { NavLink, Outlet } from "react-router-dom"

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/branches", label: "Branches" },
  { to: "/admin/rooms", label: "Rooms" },
  { to: "/admin/room-types", label: "Room Types" },
]

const linkBase =
  "block px-3 py-2 rounded-lg transition text-amber-900 hover:bg-amber-200 hover:shadow-sm"

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-amber-100 flex">
      <aside className="w-60 bg-white border-r border-amber-200 p-4 shadow-sm">
        <h1 className="text-xl font-bold text-amber-900 mb-4">Admin</h1>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? `${linkBase} bg-amber-200 font-semibold`
                  : linkBase
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 min-h-[70vh]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
