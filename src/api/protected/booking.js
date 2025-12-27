import { axiosAuth } from '../../utils/axiosInstance.js'

export const createBooking = async (bookingData) => {
    await axiosAuth.post('/bookings', bookingData)
}