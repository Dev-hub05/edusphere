import { formatFeedbackDate } from "../../utils/feedbackUtils";

const FeedbackTable = ({ feedbacks }) => {
  if (!feedbacks || feedbacks.length === 0)
    return <p className="text-gray-500">No feedback available</p>;

  return (
    <table className="w-full border rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Course</th>
          <th className="p-2">Rating</th>
          <th className="p-2">Comment</th>
          <th className="p-2">Date</th>
        </tr>
      </thead>

      <tbody>
        {feedbacks.map((f) => (
          <tr key={f.id} className="border-t">
            <td className="p-2">{f.course}</td>
            <td className="p-2">{f.rating}/5</td>
            <td className="p-2">{f.comment}</td>
            <td className="p-2">{formatFeedbackDate(f.date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbackTable;
