import { useParams } from 'react-router-dom';
import { useBranches } from '../../context/BranchesContext'
//import { useEffect, useState } from "react";

export const BranchDetails = () => {
    const { branchId } = useParams()
    const { branches, loading } = useBranches()
    console.log(branches)
    if (loading) return <p>Loading...</p>
    const branch = branches.find(b => b.id === Number(branchId))
    if (!branch) return <p>Branch not found</p>
    const branchGallery = branch.imgUrls
    console.log(branch.id)
    console.log(branchId)
    console.log(branch)


    return (
        <div key={branchId}>
            <h2>{branch.name} </h2>
            <h3>{branch.location}</h3>
            <div>{branch.description}</div>
            <div>
                {branchGallery.map(p => <img src={p} key={p} /> )}
            </div>
        </div>
    )
}