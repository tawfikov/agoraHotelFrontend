import { useState, useEffect } from "react"
import { useAuth } from '../../context/AuthContext'
import { NavLink, useNavigate } from "react-router-dom"

export const Signup = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [passConf, setPassConf] = useState("")
    const { signup, user } = useAuth()
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()

        if (!username || !passConf || !password || !name || !email) {
            setErrMsg("All required fields must be filled")
            return
        }
        if (password !== passConf) {
            setErrMsg("Passwords don't match.")
            return
        } else if (password.length < 8) {
            setErrMsg('Password is too short')
            return
        }

        if (phone && (phone.length < 11 || phone.length > 14)) {
            setErrMsg(" Phone number is invalid")
            return
        }
        if (username.length < 4 || name.length < 4) {
            setErrMsg('username and/or name is too short')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setErrMsg("Invalid email")
            return
        }
        
        try {
            const loggedIn = await signup({ username, password, phone, name, email })
            if (loggedIn) {
                console.log('signed up as', username)
            }
            
        } catch(err) {
            if (err.response?.status === 400) {
                setErrMsg(err.response.data.message)
            } else {
                setErrMsg('Something went wrong. Try again later')
                 console.error('signup failed', err)
            }
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
                Sign up
            </h2>
            <form onSubmit={handleSignup} className="space-y-4">
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} />
                
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                
                <input
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="password"
                    placeholder="Confirm passwrord"
                    value={passConf}
                    onChange={(e) => setPassConf(e.target.value)} />
                <button className="w-full bg-amber-700 text-white py-2 rounded-md hover:bg-amber-800 transition">
                    Sign up
                </button>
            </form>
            <div className="text-red-600 text-center font-bold bg-amber-200">
                {errMsg}
            </div>
            <div>
                Already have an account?  
                <NavLink
                    to="/login" end
                    className="font-bold text-amber-700"
                > Log in</NavLink> now
            </div>
            
        </div>
    )
}