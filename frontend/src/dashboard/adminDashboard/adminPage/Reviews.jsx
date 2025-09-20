import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";
import useAdminAuth from "./AdminAuth";

const AdminReviews = () => {
  const {allReviews , fetchAllReviews} = useAdminAuth()

  useEffect(() => {
    fetchAllReviews();
    scrollTo(0 , 0 )
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="py-3 px-4 font-medium text-gray-700">Student</th>
            <th className="py-3 px-4 font-medium text-gray-700">Date</th>
            <th className="py-3 px-4 font-medium text-gray-700">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {allReviews.map((review, index) => (
            <tr key={index} className={index % 2 === 1 ? "bg-blue-50" : ""}>
              <td className="py-4 px-4">{review.userId.name.charAt(0).toUpperCase() + review.userId.name.slice(1).toLowerCase()}</td>
              <td className="py-4 px-4">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="py-4 px-4">
                <div className="mb-1">
                  Course: <span className="font-medium">{review?.courseId?.title}</span>
                </div>
                <div className="text-blue-600 font-medium text-sm mt-1">
                  {review.comment}
                </div>
                <div className="flex gap-1 mt-2 text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) => {
                    if (i < Math.floor(review.rating))
                      return <FaStar key={i} />;
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

export default AdminReviews;
