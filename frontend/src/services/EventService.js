import axios from 'axios';
const SERVER_URL = "http://localhost:8080";

export const deleteEvent = async (id) => {
    try {
        await axios.delete(`${SERVER_URL}/events/delete/${id}`);
    } catch (error) {
        throw new Error('Could not delete. -Axios')
    }
}

export const getEvents = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/events`);
        return (response.data);
    } catch (error) {
        throw new Error('Could not get events. -Axios')
    }
}