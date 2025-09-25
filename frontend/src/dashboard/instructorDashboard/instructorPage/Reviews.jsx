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
    <div className=" sm:p-6">
  <h2 className="text-xl font-semibold mb-4">Reviews</h2>
  <div className="overflow-x-auto bg-white  rounded-lg">
    <table className="min-w-full text-left border border-gray-300 border-collapse">
      <thead className="bg-blue-100">
        <tr className="text-sm sm:text-base">
          <th className="py-3 px-4 font-medium text-gray-700 border border-gray-300 whitespace-nowrap">
            Student
          </th>
          <th className="py-3 px-4 font-medium text-gray-700 border border-gray-300 whitespace-nowrap">
            Course Title
          </th>
          <th className="py-3 px-4 font-medium text-gray-700 border border-gray-300 whitespace-nowrap">
            Date
          </th>
          <th className="py-3 px-4 font-medium text-gray-700 border border-gray-300 whitespace-nowrap">
            Feedback
          </th>
        </tr>
      </thead>

      <tbody className="bg-white">
        {instructorReviews.map((review, index) => (
          <tr
            key={review._id || index}
            className="hover:bg-blue-100 transition-colors"
          >
            {/* Student Name */}
            <td className="py-4 px-4 border border-gray-300 whitespace-nowrap">
              {review.userId?.name || "Unknown Student"}
            </td>

            {/* Course Title */}
            <td className="py-4 px-4 border border-gray-300 whitespace-nowrap">
              {review.courseId?.title || "Untitled Course"}
            </td>

            {/* Date */}
            <td className="py-4 px-4 border border-gray-300 whitespace-nowrap">
              {new Date(review.createdAt).toLocaleDateString()}
            </td>

            {/* Review Content */}
            <td className="py-4 px-4 border border-gray-300 min-w-[200px]">
              {/* Rating Stars */}
              <div className="text-blue-600 font-medium text-sm">
                {review.comment}
              </div>
              <div className="flex items-center gap-1 text-yellow-500 text-sm mb-1">
                {[...Array(Math.floor(review.rating))].map((_, i) => (
                  <FaStar key={i} />
                ))}
                {review.rating % 1 !== 0 && <FaStar className="opacity-50" />}
                <span className="text-gray-600 ml-2">
                  ({String(review.rating).padStart(2, "0")})
                </span>
              </div>

              
            </td>
          </tr>
        ))}

        {instructorReviews.length === 0 && (
          <tr>
            <td
              colSpan="4"
              className="text-center py-6 text-gray-500 border border-gray-300"
            >
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
