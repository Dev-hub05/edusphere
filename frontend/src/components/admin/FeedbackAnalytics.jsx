import { useEffect, useState } from "react";
import { useFeedback } from "../../context/FeedbackContext";

const FeedbackAnalytics = () => {
  const { fetchAnalytics } = useFeedback();
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchAnalytics();
      setData(res);
    };

    load();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        Feedback Analytics
      </h2>

      {data.map((course) => (
        <div key={course.id} className="mb-2">
          <p className="font-medium">{course.course}</p>
          <p>Average Rating: {course.avgRating}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackAnalytics;
