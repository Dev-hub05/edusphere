import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [timetable, setTimetable] = useState([]);

    const fetchTimetable = async (department, semester) => {
        if (!user) return;
        try {
            const { data } = await API.get("/timetable", {
                params: { department, semester }
            });
            setTimetable(data);
        } catch (error) {
            console.error("Failed to fetch timetable:", error);
        }
    };

    const addLecture = async (lectureData) => {
        try {
            const { data } = await API.post("/timetable", lectureData);
            setTimetable((prev) => [...prev, data]);
        } catch (error) {
            console.error("Failed to add lecture:", error);
        }
    };

    return (
        <TimetableContext.Provider value={{ timetable, addLecture, fetchTimetable }}>
            {children}
        </TimetableContext.Provider>
    );
};