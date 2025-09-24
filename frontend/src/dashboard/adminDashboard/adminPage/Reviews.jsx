import React, { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";
import useAdminAuth from "./AdminAuth";

const AdminReviews = () => {
  const { allReviews, fetchAllReviews } = useAdminAuth();

  useEffect(() => {
    fetchAllReviews();
    scrollTo(0, 0);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reviews</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="py-3 px-4 font-medium border border-gray-300">
                Student
              </th>
              <th className="py-3 px-4 font-medium border border-gray-300">
                Course
              </th>
              <th className="py-3 px-4 font-medium border border-gray-300">
                Date
              </th>
              <th className="py-3 px-4 font-medium border border-gray-300">
                Feedback
              </th>
              <th className="py-3 px-4 font-medium border border-gray-300">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {allReviews.map((review, index) => (
              <tr
                key={index}
                className="bg-white hover:bg-blue-50 transition-colors"
              >
                {/* Student */}
                <td className="py-3 px-4 border border-gray-300">
                  {review.userId?.name
                    ? review.userId.name.charAt(0).toUpperCase() +
                      review.userId.name.slice(1).toLowerCase()
                    : "Unknown"}
                </td>

                {/* Course */}
                <td className="py-3 px-4 border border-gray-300 font-medium text-gray-700">
                  {review?.courseId?.title || "N/A"}
                </td>

                {/* Date */}
                <td className="py-3 px-4 border border-gray-300 text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Feedback */}
                <td className="py-3 px-4 border border-gray-300 text-blue-600">
                  {review.comment || "No feedback"}
                </td>

                {/* Rating */}
                <td className="py-3 px-4 border border-gray-300">
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => {
                      if (i < Math.floor(review.rating)) return <FaStar key={i} />;
                      if (i < review.rating) return <FaRegStarHalfStroke key={i} />;
                      return <FaRegStar key={i} />;
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;
