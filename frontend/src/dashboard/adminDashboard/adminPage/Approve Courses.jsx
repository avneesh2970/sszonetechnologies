import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyEnrollmentsChart = () => {
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3999/api/payment/all"
        );
        const data = res.data?.monthlyEnrollments || [];
        const filledData = Array.from({ length: 12 }, (_, i) => {
          const monthItem = data.find((item) => item._id === i + 1);
          return monthItem ? monthItem.count : 0;
        });
        setMonthlyData(filledData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchData();
  }, []);

  const monthsLabels = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const chartData = {
    labels: monthsLabels,
    datasets: [
      {
        type: "bar",
        label: "Enrollments",
        data: monthlyData,
        backgroundColor: "rgba(54, 209, 220, 0.8)",
        borderRadius: 8,
        barThickness: 30,
      },
      {
        type: "line",
        label: "Trend",
        data: monthlyData,
        borderColor: "#ff6a00",
        backgroundColor: "rgba(255,106,0,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#ff6a00",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Monthly Course Enrollments",
        font: { size: 18, weight: "bold" },
      },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, stepSize: 1 },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <p className="font-semibold text-lg">Monthly Course Enrollments </p>
      <Chart data={chartData} options={options} /> {/* ✅ remove type="bar" */}
    </div>
  );
};

export default MonthlyEnrollmentsChart;
