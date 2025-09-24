import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function useAdminAuth() {
  // Get Profile/setting Details

  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-setting`
      );
      if (res.data.success && res.data.data.length > 0) {
        setProfile(res.data.data[0]); // Assuming only 1 admin setting
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const [payment, setPayment] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/all-purchases`,
        { withCredentials: true } // 🔑 if authentication required
      );

      if (data.success) {
        setPayment(data.allPurchase || []); // ensure fallback
        // toast.success("Payments loaded successfully");
      } else {
        toast.error("Failed to load payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments");
    }
  };
  // ✅ Calculate total when payment changes
  useEffect(() => {
    const total = payment.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalAmount(total);
  }, [payment]);

  // Get all course lenth in admin dashboard
  const [allCourses, setAllCourses] = useState([]);

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`,
        {
          withCredentials: true,
        }
      );
      setAllCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  //   Get All review
  const [allReviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const fetchAllReviews = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        {
          withCredentials: true,
        }
      );
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to get reviews");
    }
  };

  // 🧠 Calculate average rating whenever reviews change
  useEffect(() => {
    if (allReviews.length > 0) {
      const total = allReviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
      );
      const avg = total / allReviews.length;
      setAverageRating(avg.toFixed(1)); // e.g. 4.3
    } else {
      setAverageRating(0);
    }
  }, [allReviews]);

  return {
    payment,
    fetchPayments,
    totalAmount,
    allCourses,
    fetchAllCourses,
    allReviews,
    fetchAllReviews,
    averageRating,
    profile,
    fetchProfile,
  };
}
