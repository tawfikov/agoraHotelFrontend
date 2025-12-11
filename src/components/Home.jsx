const Home =() => {
    return (
        <div className="bg-amber-200 min-h-screen flex items-start px-8 pt-16 ">
            <div className="flex-1 pr-12">
                <h1 className="text-4xl font-bold text-amber-950">
                Premium stays across top Egyptian cities.
                </h1>
                <p className="text-lg mb-6 text-amber-900">
                Enjoy full board luxury and 5-star comfort with Agora Hotels.
                </p>
        
                <div className="w-full h-98 rounded-xl overflow-hidden shadow-lg bg-gray-300">
                {/*for carousel component*/}
                </div>
            </div>
            <div className="shadow-md rounded-lg p-8 my-4 border border-black w-400 max-w-md mx-auto bg-amber-50">
                <form method="post" className="space-y-4">
                    <label className="block">City 
                        <input type="text" className="w-full border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 " />
                    </label>
                    <label className="block">From 
                        <input type="date" className="w-full border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 "/>
                    </label>
                    <label className="block">To 
                        <input type="date" className="w-full border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 "/>
                    </label>
                    <label className="block">Guests 
                        <input type="number" className="w-full border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 "/>
                    </label>
                    <input type="submit" value="Book now!" className="w-full bg-amber-700 text-white py-2 rounded-md hover:bg-amber-800 transition"/>
                </form>
            </div>
        </div>
    )
}
export default Home