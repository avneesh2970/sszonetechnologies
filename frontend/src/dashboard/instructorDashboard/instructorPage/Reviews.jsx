import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import useAuth from "./hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";

const InstructorReviews = () => {
  const { instructor , fetchInstructorReviews , instructorReviews } = useAuth();
  
  useEffect(() => {
    fetchInstructorReviews();
  }, [instructor?._id]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-sm sm:text-base">
              <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                Student
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                Date
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody>
            {instructorReviews.map((review, index) => (
              <tr
                key={review._id || index}
                className={index % 2 === 1 ? "bg-blue-50" : ""}
              >
                {/* Student Name */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {review.userId?.name || "Unknown Student"}
                </td>

                {/* Date */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>

                {/* Review Content */}
                <td className="py-4 px-4 min-w-[200px]">
                  <div className="mb-1 text-sm sm:text-base">
                    Course:{" "}
                    <span className="font-medium">
                      {review.courseId?.title || "Untitled Course"}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                    {review.rating % 1 !== 0 && <FaStar className="opacity-50" />}
                    <span className="text-gray-600 ml-2">
                      ({String(review.rating).padStart(2, "0")})
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="text-blue-600 font-medium text-sm mt-1">
                    {review.comment}
                  </div>
                </td>
              </tr>
            ))}

            {instructorReviews.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorReviews;
