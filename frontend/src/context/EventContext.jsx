import { createContext, useState, useEffect, useContext, useCallback } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);

    const fetchEvents = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await API.get("/common/events");
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    }, [user]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const addEvent = async (eventData) => {
        try {
            const { data } = await API.post("/admin/events", eventData);
            setEvents((prev) => [...prev, data.event]);
        } catch (error) {
            console.error("Failed to add event:", error);
        }
    };

    const deleteEvent = async (id) => {
        try {
            await API.delete(`/admin/events/${id}`);
            setEvents((prev) => prev.filter((e) => e._id !== id));
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    return (
        <EventContext.Provider value={{ events, addEvent, deleteEvent, fetchEvents }}>
            {children}
        </EventContext.Provider>
    );
};