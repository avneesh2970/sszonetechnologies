import axios from "axios";

import react, { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "./hooks/useAuth";

const orders = [
  {
    id: "#5478",
    course: "App Development",
    date: "January 27, 2024",
    price: "₹ 4,999",
    status: "Success",
  },
  {
    id: "#5450",
    course: "Graphic Design",
    date: "January 12, 2024",
    price: "₹ 4,999",
    status: "Pending",
  },
  {
    id: "#5410",
    course: "MERN Stack",
    date: "March 20, 2025",
    price: "₹ 4,999",
    status: "Failed",
  },
  {
    id: "#5450",
    course: "Graphic Design",
    date: "January 12, 2024",
    price: "₹ 4,999",
    status: "Pending",
  },
  {
    id: "#5478",
    course: "App Development",
    date: "January 27, 2024",
    price: "₹ 4,999",
    status: "Success",
  },
  {
    id: "#5450",
    course: "Graphic Design",
    date: "January 12, 2024",
    price: "₹ 4,999",
    status: "Pending",
  },
  {
    id: "#5410",
    course: "MERN Stack",
    date: "March 20, 2025",
    price: "₹ 4,999",
    status: "Failed",
  },
  {
    id: "#5450",
    course: "Graphic Design",
    date: "January 12, 2024",
    price: "₹ 4,999",
    status: "Pending",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Success":
      return "text-green-600";
    case "Pending":
      return "text-yellow-500";
    case "Failed":
      return "text-red-600";
    default:
      return "";
  }
};

const InstructorOrderHistory = () => {
  const { instructor, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!instructor) return <p>You must be logged in as an instructor.</p>;

  return (
    <>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>

        <div className="bg-blue-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 font-semibold text-gray-700 border-b px-4 py-3">
            <div>Order ID</div>
            <div>Course Name</div>
            <div>Date</div>
            <div>Price</div>
            <div>Status</div>
          </div>

          {orders.map((order, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-5 px-4 py-3 text-sm border-b ${
                idx % 2 === 0 ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div>{order.id}</div>
              <div>{order.course}</div>
              <div>{order.date}</div>
              <div>{order.price}</div>
              <div className={`font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InstructorOrderHistory;
