const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-amber-50">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin" />

      {/* Text */}
      <p className="mt-4 text-sm text-amber-900 font-medium">
        Loading your experience…
      </p>
    </div>
  )
}

export default PageLoader
