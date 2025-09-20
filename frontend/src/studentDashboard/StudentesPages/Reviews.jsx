import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useStudentAuth } from "./studentAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";

const Reviews = () => {
  const { fetchReviews , myReviews , user} = useStudentAuth();

  useEffect(() => {
    fetchReviews();
  }, [user]);

  if (!myReviews) {
    return <div>Loading...............</div>;
  }

  return (
   <div className="max-w-6xl p-6">
  <h2 className="text-3xl font-bold text-gray-900 mb-4">Reviews</h2>
  <table className="w-full text-left border border-gray-300 border-collapse">
    <thead>
      <tr className="bg-blue-100">
        <th className="py-3 px-4 font-medium text-gray-700 border border-gray-300">
          Course
        </th>
        <th className="py-3 px-4 font-medium text-gray-700 border border-gray-300">
          Date
        </th>
        <th className="py-3 px-4 font-medium text-gray-700 border border-gray-300">
          Feedback
        </th>
      </tr>
    </thead>
    <tbody>
      {myReviews?.map((review, index) => (
        <tr key={index} className="bg-white">
          <td className="py-4 px-4 border border-gray-300">
            {review?.courseId?.title.charAt(0).toUpperCase() +
              review?.courseId?.title.slice(1).toLowerCase()}
          </td>
          <td className="py-4 px-4 border border-gray-300">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </td>
          <td className="py-4 px-4 border border-gray-300">
            {/* <div className="mb-1">
              Course:{" "}
              <span className="font-medium">{review?.courseId?.title}</span>
            </div> */}
            <div className="text-blue-600 font-medium text-sm mt-1">
              {review.comment}
            </div>
            <div className="flex gap-1 mt-2 text-yellow-400">
              {Array.from({ length: 5 }, (_, i) => {
                if (i < Math.floor(review.rating)) return <FaStar key={i} />;
                if (i < review.rating)
                  return <FaRegStarHalfStroke key={i} />;
                return <FaRegStar key={i} />;
              })}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default Reviews;
