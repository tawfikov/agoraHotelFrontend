import { useState } from "react"
import { useAuth } from '../context/AuthContext'

export const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { loginCon, user } = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await loginCon({ username, password })
            console.log('logged in')
        } catch(err) {
            console.error('login failed', err)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            {user && <p>Welcome {user.name}</p>}
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="username or email" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button>Login</button>
            </form>
        </div>
    )
}