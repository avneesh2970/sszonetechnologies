// hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useAuth() {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  // to get Login user 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/instructor/me`,
          {
            withCredentials: true, // send cookies
          }
        );
        setInstructor(res.data);
      } catch (err) {
        setInstructor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

   

// //fetch review of instructor
  const [instructorReviews, setInstructorReviews] = useState([]);

  const fetchInstructorReviews = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/instructor/me`,
        { withCredentials: true }
      );

      setInstructorReviews(data.reviews);
    } catch (error) {
      toast.error("Failed to get instructor reviews");
    }
  };

  //fetch course of instructor 
   const [courses, setCourses] = useState([]);

  const fetchInstructorCourses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/my-courses`,
        {
          withCredentials: true,
        }
      );
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };
  

  return {
    instructor,
    loading,
    instructorReviews,
    fetchInstructorReviews,
    courses,
    fetchInstructorCourses,
  
  };
}
