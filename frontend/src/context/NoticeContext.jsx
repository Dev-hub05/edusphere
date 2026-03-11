import { createContext, useState, useEffect, useContext, useCallback } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const NoticeContext = createContext();

export const NoticeProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notices, setNotices] = useState([]);

    const fetchNotices = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await API.get("/common/notices");
            setNotices(data);
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        }
    }, [user]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    const addNotice = async (noticeData) => {
        try {
            const { data } = await API.post("/admin/notices", noticeData);
            setNotices((prev) => [data.notice, ...prev]);
        } catch (error) {
            console.error("Failed to default add notice:", error);
        }
    };

    const deleteNotice = async (id) => {
        try {
            await API.delete(`/admin/notices/${id}`);
            setNotices((prev) => prev.filter((n) => n._id !== id));
        } catch (error) {
            console.error("Failed to delete notice:", error);
        }
    };

    return (
        <NoticeContext.Provider value={{ notices, addNotice, deleteNotice, fetchNotices }}>
            {children}
        </NoticeContext.Provider>
    );
};