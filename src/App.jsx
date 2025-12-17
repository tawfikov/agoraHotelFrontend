import { NavLink, Outlet } from "react-router-dom"
import { useBranches } from './context/BranchesContext'
import { useState } from "react"
import { useAuth } from "./context/AuthContext"
//import { axiosAuth } from "./api/axiosAuth"

function App() {

  const [open, setOpen] = useState(false)
  const { branches, loading } = useBranches()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      console.log('logged out')
    } catch(err) {
      console.error('failed to logout', err)
    }
  }

  return (
    <>
    <nav className="flex flex-row w-full justify-between bg-amber-800 text-white px-6 py-4 shadow-md rounded-b-sm">
      <div className="flex items-center gap-3">
        <img src="../../public/pyramid-svgrepo-com.svg" className="w-12 h-12"/>
        <h1 className="text-2xl font-bold">Agora Hotels</h1>
      </div>
      <div className="flex items-center gap-8 text-lg">
        <NavLink to="/" end
        className={({ isActive }) =>
        isActive ? "font-semibold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        : "hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] transition"
        }
        >
          Home
        </NavLink>
        <div
          className="relative group hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] transition"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          >
          <span className="cursor-pointer">Our Branches</span>

          {open && (
            <div
            className="absolute hidden group-hover:block bg-amber-200 opacity-80 text-black p-2 rounded shadow w-max"
            >
              {loading? (<p>Loading...</p>) : (

                branches.map(b => (
                  <NavLink
                  key={b.id}
                  to={`/branches/${b.id}`}
                  className="block px-2 py-1 hover:bg-amber-50"
                  >
                    {b.name}
                  </NavLink>
                ))
              )}
            </div>
          )}
        </div>
        <NavLink to="/rooms" end
        className={({ isActive }) =>
        isActive ? "font-semibold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        : "hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] transition"
        }
        >
          Rooms
        </NavLink>
        {loading? null : user ? (
          <>
            <div>
              Welcome, {user.name}
            </div>
            <div>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>  
      ) : (
             <NavLink to="/login" end
        className={({ isActive }) =>
        isActive ? "font-semibold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        : "hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] transition"
        }
        >
          Login
        </NavLink>
   
      )}
        
      </div>
    </nav>
    <Outlet />
    </>
  )
}

export default App
