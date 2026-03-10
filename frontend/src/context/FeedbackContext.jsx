import { createContext, useContext, useState } from "react";
import {
    submitFeedback,
    getStudentFeedback,
    getCourseFeedback,
    getFeedbackAnalytics
} from "../services/feedbackService";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [feedbackList, setFeedbackList] = useState([]);

    const addFeedback = async (data) => {
        const res = await submitFeedback(data);
        setFeedbackList((prev) => [...prev, res]);
    };

    const fetchStudentFeedback = async () => {
        const data = await getStudentFeedback();
        setFeedbackList(data);
    };

    const fetchCourseFeedback = async (courseId) => {
        return await getCourseFeedback(courseId);
    };

    const fetchAnalytics = async () => {
        return await getFeedbackAnalytics();
    };

    return (
        <FeedbackContext.Provider
            value={{
                feedbackList,
                addFeedback,
                fetchStudentFeedback,
                fetchCourseFeedback,
                fetchAnalytics
            }}
        >
            {children}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => useContext(FeedbackContext);