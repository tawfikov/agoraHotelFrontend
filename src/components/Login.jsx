import { useState, useEffect } from "react"
import { useAuth } from '../context/AuthContext'
import { NavLink, useNavigate } from "react-router-dom"

export const Login = () => {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const { login, user } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!identifier || !password) {
            setErrMsg("please provide your credentials")
            return
        }


        try {
            await login({ username: identifier, email: identifier, password })
            
        } catch(err) {
            setErrMsg(err.response.data.message)
        }
    }

     useEffect(() => {
        if (user) {
         navigate("/", { replace: true })
        }
     }, [user, navigate])

     if (user) return null

    return (
        <div 
        className="mx-auto my-10 w-full max-w-md rounded-lg border border-amber-200 bg-amber-50 p-8 shadow-md space-y-6">
            <h2 className="text-3xl font-bold text-center">
                Log in
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="text"
                    placeholder="Username or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)} />
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full bg-amber-700 text-white py-2 rounded-md hover:bg-amber-800 transition">
                    Login
                </button>
            </form>
            <div className="text-red-600 text-center font-bold bg-amber-100 rounded-2xl">
                {errMsg}
            </div>
            <div>
                Don't have an account?  
                <NavLink
                    to="/signup" end
                    className="font-bold text-amber-700"
                > Sign up</NavLink> now
            </div>
        </div>
    )
}