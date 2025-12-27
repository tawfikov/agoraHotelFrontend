/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { refresh, login, logout, signup } from '../api/auth.js'
import { axiosAuth } from "../api/axiosAuth.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const tokenRef = useRef(null)

    const extractToken = (payload) => payload?.accessToken ?? null

    const applyToken = (token) => {
        tokenRef.current = token
        setAccessToken(token)
        if (token) {
            axiosAuth.defaults.headers.common.Authorization = `Bearer ${token}`
        } else {
            delete axiosAuth.defaults.headers.common.Authorization
        }
    }


    useEffect(() => {
    const restore = async () => {
      try {
        const res = await refresh()
        const token = extractToken(res)
        if (token) {
          applyToken(token)
        }
        if (res?.refreshToken) {
          setRefreshToken(res.refreshToken)
        }
        setUser(res.user)
      } catch {
        setUser(null)
        setAccessToken(null)
      } finally {
        setAuthLoading(false)
      }
    }

    restore()
  }, [])


    useEffect(() => {
        // automatically attach access token to requests.
        const reqInt = axiosAuth.interceptors.request.use(
            (config) => {
                const token = tokenRef.current
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            }
        )

        const resInt = axiosAuth.interceptors.response.use(
            res => res,
            //when request throws 401
            async (err) => {
                const originalReq = err.config
                if (originalReq.url.includes("/auth/refresh")) {
                    return Promise.reject(err)
                }
                if (err.response?.status === 401 && !originalReq._retry) {
                    originalReq._retry = true
                    //call refresh endpoint once
                    try {
                        const res = await refresh()
                        const token = extractToken(res)
                        if (token) {
                          applyToken(token)
                          originalReq.headers.Authorization = `Bearer ${token}`
                        }
                        if (res?.refreshToken) {
                          setRefreshToken(res.refreshToken)
                        }
                        //resend the original request
                        return axiosAuth(originalReq)
                    } catch {
                        setAccessToken(null)
                        setRefreshToken(null)
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
    },[accessToken])

    useEffect(() => {
        tokenRef.current = accessToken
    }, [accessToken])

    const loginCon = async (creds) => {
        const res = await login(creds)
        const token = extractToken(res)
        if (token) {
          applyToken(token)
        }
        if (res?.refreshToken) {
          setRefreshToken(res.refreshToken)
        }
        setUser(res.user)
    }

    const logoutCon = async () => {
        await logout()
        setUser(null)
        applyToken(null)
        setRefreshToken(null)
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
            refreshToken,
            login: loginCon,
            logout: logoutCon,
            signup: signupCon,
            authLoading,
            isAuth: user !== null
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
