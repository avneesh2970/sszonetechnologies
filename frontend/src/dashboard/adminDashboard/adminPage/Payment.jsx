import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAdminAuth from "./AdminAuth";



const statusColor = {
  paid: "text-green-600",
  Pending: "text-yellow-500",
  Failed: "text-red-600",
};

const AdminPayment = () => {
  const {payment , fetchPayments } = useAdminAuth();
  


useEffect(() => {
  fetchPayments();
}, []); // ✅ Only run once

 

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-blue-50 text-left">
            <tr>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Price </th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payment.map((payment, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              >
                <td className="px-4 py-2">{payment.razorpay.orderId}</td>
                <td className="px-4 py-2">{payment.user.name.charAt(0).toUpperCase() + payment.user.name.slice(1).toLowerCase()}</td>
                <td className="px-4 py-2">{new Date(payment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}</td>
                <td className="px-4 py-2">₹{" "}{payment.amount}</td>
                <td className={`px-4 py-2 font-medium ${statusColor[payment.status]}`}>
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer autoClose={2000}/>
    </div>
  );
};

export default AdminPayment;
