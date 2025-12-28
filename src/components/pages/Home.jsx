import { useEffect, useState } from "react"
import axios from "axios"
import { ImageCarousel } from "../ImageCarousel"

const Home = () => {
    const [images, setImages] = useState([])

    useEffect(() => {
        const carouselHandler = async () => {
            const url = 'http://localhost:3000/api/branches/imgs'
            try {
                const { data } = await axios.get(url)
                setImages(data.urlArray)
            } catch(err) {
                console.error(err)
            }
        }
        carouselHandler()
    }, [])

    return (
    <div className="bg-amber-100 min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
                <h1 className="text-4xl font-bold text-amber-950">
                Premium stays across top Egyptian cities.
                </h1>
        <p className="text-lg text-amber-900 max-w-3xl">
                Enjoy full board luxury and 5-star comfort with Agora Hotels.
                </p>
        
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-amber-200 bg-white">
                <ImageCarousel images={images} />
                </div>
            </div>
        </div>
    )
}
export default Home