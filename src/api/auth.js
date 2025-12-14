import axios from "axios";

const baseUrl = 'http://localhost:3000/api/auth'

export const login = async (creds) => {
    const res = await axios.post(`${baseUrl}/login`, creds, { withCredentials: true })
    return res.data
}

export const refresh = async () => {
    const res = await axios.post(`${baseUrl}/refresh`, {}, { withCredentials: true })
    return res.data
}

export const logout = async () => {
    const res = await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true })
    return res.data
}

export const signup = async (creds) => {
    const res = await axios.post(`${baseUrl}/signup`, creds, { withCredentials: true })
    return res.data
}

//let token = null
//export const setToken = (newToken) => {
//    token = `Bearer ${newToken}`
//}