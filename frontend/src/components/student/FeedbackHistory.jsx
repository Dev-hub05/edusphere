import { useEffect } from "react";
import { useFeedback } from "../../context/FeedbackContext";
import FeedbackTable from "../common/FeedbackTable";

const FeedbackHistory = () => {
  const { feedbackList, fetchStudentFeedback } = useFeedback();

  useEffect(() => {
    fetchStudentFeedback();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        My Feedback
      </h2>

      <FeedbackTable feedbacks={feedbackList} />
    </div>
  );
};

export default FeedbackHistory;
