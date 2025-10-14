// useStudentAuth.js
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useStudentAuth = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  //  fetch login user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // All user
  const [allUser, setAllUser] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/all`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setAllUser(res.data.users); // set users state
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);

      toast.success("Logged out successfully 👋");
    } catch (err) {
      toast.error("Logout failed ❌");
    }
  };

  // 🔹 reusable fetchCartItems function

  const fetchCartItems = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          withCredentials: true,
        }
      );
      setCartItems(res.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]); // reset on error
    }
  }, []);

  // fetch cart initially
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
        {
          withCredentials: true,
        }
      );
      setWishlistItems(res.data || []);
      // setLoading(false);
    } catch (err) {
      console.error(err);
      // setError("Failed to fetch wishlist");
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  //for fetching payment details login user and enroll course
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/my-purchases`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setPurchases(res.data.purchases);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPurchases();
  }, []);

  //Fetch Reviews
  const [myReviews, setMyReviews] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        {
          withCredentials: true,
        }
      );
      setReviews(data.reviews);

      // ✅ filter reviews by login user
      if (user?._id) {
        const filtered = data.reviews.filter(
          (review) => review.userId?._id === user._id
        );
        setMyReviews(filtered);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to get reviews");
    }
  };


  return {
    user,
    setUser,
    logout,
    cartItems,
    setCartItems,
    fetchCartItems,
    wishlistItems,
    setWishlistItems,
    loading,
    setLoading,
    fetchWishlist,
    purchases,
    reviews,
    fetchReviews,
    myReviews,
    allUser,
    fetchAllUsers,
    };
};
