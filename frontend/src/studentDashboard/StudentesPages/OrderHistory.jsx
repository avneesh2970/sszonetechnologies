import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStudentAuth } from "./studentAuth";

const OrderHistory = () => {
  const {purchases} = useStudentAuth()

  return (
    <div className="p-6 ">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">My Purchases</h2>

      {purchases.length === 0 ? (
        <p className="text-gray-500">No purchases found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-blue-100 font-bold ">
              <tr>
                <th className="p-3 text-left  font-bold text-gray-700 border border-gray-300 ">
                  Payment ID
                </th>
                <th className="p-3 text-left  font-bold text-gray-700 border border-gray-300">
                  Course Name
                </th>
                <th className="p-3 text-left  font-bold text-gray-700 border border-gray-300">
                  Price (₹)
                </th>
                <th className="p-3 text-left  font-bold text-gray-700 border border-gray-300">
                  Status
                </th>
                <th className="p-3 text-left  font-bold text-gray-700 border border-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={index} className="hover:bg-blue-100 bg-white">
                  <td className="p-3  border border-gray-300">
                    {purchase.razorpay.paymentId}
                  </td>
                  <td className="p-3  border border-gray-300">
                    {purchase.product && purchase.product.length > 0
                      ? purchase.product
                          .map((course) => course.title)
                          .join(", ")
                      : "N/A"}
                  </td>
                  <td className="p-3  border border-gray-300">₹ {purchase.amount}</td>
                  <td
                    className={`p-3 text-sm border border-gray-300 font-medium ${
                      purchase.status === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {purchase.status}
                  </td>
                  <td className="p-3 text-sm border border-gray-300">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
