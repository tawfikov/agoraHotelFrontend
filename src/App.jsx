import { NavLink, Outlet } from "react-router-dom"

function App() {


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

        <NavLink to="/branches" end
        className={({ isActive }) =>
        isActive ? "font-semibold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        : "hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] transition"
        }
        >
          Our Branches
        </NavLink>

        <NavLink to="/rooms" end
        className={({ isActive }) =>
        isActive ? "font-semibold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        : "hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] transition"
        }
        >
          Rooms
        </NavLink>

        <NavLink to="/login" end
        className={({ isActive }) =>
        isActive ? "font-semibold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        : "hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] transition"
        }
        >
          Login
        </NavLink>
        
      </div>
    </nav>
    <Outlet />
    </>
  )
}

export default App
