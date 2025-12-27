import { axiosAuth } from '../../api/axiosAuth'

export const createBooking = async (bookingData) => {
    const { data } = await axiosAuth.post('/booking/checkout', bookingData)
    return data
}
