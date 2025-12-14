/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext } from "react";
import { refresh, login, logout, signup } from '../api/auth.js'
import { axiosAuth } from "../api/axiosAuth.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
    const restore = async () => {
      try {
        const res = await refresh()
        setAccessToken(res.accessToken)
        setUser(res.user)
      } catch {
        setUser(null)
        setAccessToken(null)
      } finally {
        setLoading(false)
      }
    }

    restore()
  }, [])


    useEffect(() => {
        const reqInt = axiosAuth.interceptors.request.use(
            (config) => {
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`
                }
                return config
            }
        )

        const resInt = axiosAuth.interceptors.response.use(
            res => res,
            async (err) => {
                const originalReq = err.config
                if (originalReq.url.includes("/auth/refresh")) {
                    return Promise.reject(err)
                }
                if (err.response?.status === 401 && !originalReq._retry) {
                    originalReq._retry = true

                    try {
                        const res = await refresh()
                        setAccessToken(res.accessToken)
                        originalReq.headers.Authorization = `Bearer ${res.accessToken}`
                        return axiosAuth(originalReq)
                    } catch {
                        setAccessToken(null)
                        setUser(null)
                    }
                }
                return Promise.reject(err)
            }
        )
        return () => {
            axiosAuth.interceptors.request.eject(reqInt)
            axiosAuth.interceptors.response.eject(resInt)
        }
    },)

    const loginCon = async (creds) => {
        const res = await login(creds)
        setUser(res.user)
        setAccessToken(res.accessToken)
    }

    const logoutCon = async () => {
        await logout()
        setUser(null)
        setAccessToken(null)
    }

    const signupCon = async (creds) => {
        const res = await signup(creds)
        await loginCon({ username: creds.username, password: creds.password })
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            accessToken,
            loginCon,
            logoutCon,
            signupCon,
            isAuth: user !== null
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)