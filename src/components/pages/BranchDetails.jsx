import { useParams } from 'react-router-dom'
import { useBranches } from '../../context/BranchesContext'

export const BranchDetails = () => {
  const { branchId } = useParams()
  const { branches, loading } = useBranches()

  if (loading) {
    return (
      <div className="bg-amber-100 min-h-screen flex items-center justify-center text-amber-900">
        Loading branch...
      </div>
    )
  }

  const branch = branches.find((b) => b.id === Number(branchId))
  if (!branch) {
    return (
      <div className="bg-amber-100 min-h-screen flex items-center justify-center text-amber-900">
        Branch not found
      </div>
    )
  }

  return (
    <div className="bg-amber-100 min-h-screen py-10 px-6" key={branchId}>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
          <h2 className="text-3xl font-bold text-amber-900">{branch.name}</h2>
          <p className="text-lg text-amber-800 mt-1">{branch.location}</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3">
            <img
              src={branch.imgUrls?.[0]}
              alt={branch.name}
              className="w-full h-48 object-cover rounded-xl border border-amber-200 shadow-sm"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-amber-900 mb-3">About</h3>
            <p className="text-amber-900 leading-relaxed">
              {branch.description || "No description available."}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
