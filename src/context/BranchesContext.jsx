import { useState, useEffect, createContext, useContext } from "react";
import { getAllBranches } from '../api/public/branches.js'

// eslint-disable-next-line react-refresh/only-export-components
export const BranchesContext = createContext()

export const BranchProvider = ({ children }) => {
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const res = await getAllBranches()
                setBranches(res.branches)
            } finally {
                setLoading(false)
            }
        }
        loadBranches()
    }, [])

    return (
    <BranchesContext.Provider value={{ branches, loading }}>
        { children }
    </BranchesContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBranches = () => useContext(BranchesContext)

