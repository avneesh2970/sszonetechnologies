import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Courses from "./pages/Courses.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import CourseDetails from "./pages/courseDetails.jsx";
// import Dashboard from "./componant/Dashboard.jsx";
import Overview from "./studentDashboard/StudentesPages/Overview.jsx";
import Profile from "./studentDashboard/StudentesPages/MyProfile.jsx";
import EnrollCourse from "./studentDashboard/StudentesPages/EnrollCourse.jsx";
import StuWishlist from "./studentDashboard/StudentesPages/stuWishlist.jsx";
import Reviews from "./studentDashboard/StudentesPages/Reviews.jsx";
import Quiz from "./studentDashboard/StudentesPages/MyQuiz.jsx";
import Message from "./studentDashboard/StudentesPages/Message.jsx";
import Assignment from "./studentDashboard/StudentesPages/Assignments.jsx";
import Settings from "./studentDashboard/StudentesPages/Setting.jsx";
import Logout from "./studentDashboard/StudentesPages/LogOut.jsx";
import InstructorOutlet from "./dashboard/instructorDashboard/InstructorOutlet.jsx";
import InstructorOverview from "./dashboard/instructorDashboard/instructorPage/Overview.jsx";
import InstructorProfile from "./dashboard/instructorDashboard/instructorPage/MyProfile.jsx";
import InstructorCourse from "./dashboard/instructorDashboard/instructorPage/MyCourses.jsx";
import InstructorWishlist from "./dashboard/instructorDashboard/instructorPage/Wishlist.jsx";
import InstructorReviews from "./dashboard/instructorDashboard/instructorPage/Reviews.jsx";
import InstructorMyQuiz from "./dashboard/instructorDashboard/instructorPage/MyQuiz.jsx";
import InstructorMessage from "./dashboard/instructorDashboard/instructorPage/Message.jsx";
import InstructorAnnouncement from "./dashboard/instructorDashboard/instructorPage/Announcement.jsx";
import InstructorOrderHistory from "./dashboard/instructorDashboard/instructorPage/OrderHistory.jsx";
import InstructorAssignment from "./dashboard/instructorDashboard/instructorPage/Assignments.jsx";
import InstructorSettings from "./dashboard/instructorDashboard/instructorPage/Setting.jsx";
import InstructorLogout from "./dashboard/instructorDashboard/instructorPage/LogOut.jsx";
import AdminOutlet from "./dashboard/adminDashboard/AdminOutlet.jsx";
import AdminOverview from "./dashboard/adminDashboard/adminPage/Overview.jsx";
import AdminProfile from "./dashboard/adminDashboard/adminPage/MyProfile.jsx";
import AdminCourse from "./dashboard/adminDashboard/adminPage/Courses.jsx";
import AdminMessage from "./dashboard/adminDashboard/adminPage/Message.jsx";
import AdminReviews from "./dashboard/adminDashboard/adminPage/Reviews.jsx";
import AdminQuizAttempt from "./dashboard/adminDashboard/adminPage/QuizAttempt.jsx";
import AdminCategory from "./dashboard/adminDashboard/adminPage/Category.jsx";
import AdminPayment from "./dashboard/adminDashboard/adminPage/Payment.jsx";
import AdminSettings from "./dashboard/adminDashboard/adminPage/Setting.jsx";
import AdminLogout from "./dashboard/adminDashboard/adminPage/Logout.jsx";
import AdminProtectedRoute from "./componant/AdminProtectedRoute.jsx";
import Login from "./dashboard/adminDashboard/adminPage/Login.jsx";
import InstructorLogin from "./dashboard/instructorDashboard/instructorPage/InstructorLogin.jsx";
import InstructorProtectedRoute from "./dashboard/instructorDashboard/instructorPage/hooks/ProtectedRoute.jsx";
import AdminCourseAdd from "./dashboard/adminDashboard/AdminCourseAdd.jsx";
import AllCoursesPage from "./courseUpload/AllCoursesPage.jsx";
import Announcement from "./dashboard/adminDashboard/adminPage/Announcement.jsx";
import AdminBlogs from "./dashboard/adminDashboard/adminPage/AdminBlogs.jsx";

import AdminBlogDetailPage from "./dashboard/adminDashboard/adminPage/AdminBlogDetails.jsx";
import AdminCourseDetails from "./dashboard/adminDashboard/adminPage/CourseDetails.jsx";
import InstructorSignup from "./dashboard/instructorDashboard/instructorPage/InstructorSignUp.jsx";
import User from "./dashboard/instructorDashboard/InstructorProtectedRoute.jsx";
import InstructorCourseAddHomePage from "./Instructor-courseUpload/HomePage.jsx";
import InstructorCourseDetails from "./dashboard/instructorDashboard/instructorPage/MyCourseDetails.jsx";
import StudentCourseDetail from "./studentDashboard/StudentesPages/EnrollCourseDetails.jsx";

import AddQuestionsForm from "./Instructor-courseUpload/AddQuestion.jsx";
import StudentQuiz from "./Instructor-courseUpload/QuizAttempt.jsx";
import OrderHistory from "./studentDashboard/StudentesPages/OrderHistory.jsx";
import Dashboard from "./studentDashboard/StudentesPages/Dashboard.jsx";
import { AllCourse } from "./studentDashboard/StudentesPages/AllCourse.jsx";
import StuAllCourseDetails from "./studentDashboard/StudentesPages/AllCourseDetails.jsx";
import LoginModal from "./componant/LoginModal.jsx";
import SignupModal from "./componant/SignupModal.jsx";
import UploadQuiz from "./Instructor-courseUpload/UploadQuiz.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <AboutUs /> },
      { path: "courses", element: <Courses /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "cart", element: <Cart /> },
      { path: "blogs", element: <Blog /> },
      { path: "blogs/:id", element: <BlogDetails /> },
      { path: "courseDetailsOverview/:courseId", element: <CourseDetails /> },
      {path : 'login' , element : <LoginModal/>},
      {path : 'signup' , element : <SignupModal/>}
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Overview /> },
      { path: "profile", element: <Profile /> },
      { path: "allCourse", element: <AllCourse /> },
      { path: "stuAllCourse/:id", element: <StuAllCourseDetails /> },
      { path: "enrollCourse", element: <EnrollCourse /> },
      { path: "enrollCourseDetails/:id", element: <StudentCourseDetail /> },
      { path: "wishlist", element: <StuWishlist /> },
      { path: "review", element: <Reviews /> },
      { path: "myQuiz", element: <Quiz /> },
      { path: "message", element: <Message /> },
      { path: "assignments", element: <Assignment /> },
      { path: "myOrder", element: <OrderHistory /> },
      { path: "setting", element: <Settings /> },
      { path: "logout", element: <Logout /> },
    ],
  },
  // {path : '/instructor' , element : (<InstructorProtectedRoute><InstructorOutlet/></InstructorProtectedRoute>) ,
  {
    path: "/instructor",
    element: (
      <InstructorProtectedRoute>
        <InstructorOutlet />
      </InstructorProtectedRoute>
    ),
    children: [
      { index: true, element: <InstructorOverview /> },
      { path: "profile", element: <InstructorProfile /> },
      { path: "enrollCourse", element: <InstructorCourse /> },
      {
        path: "courses-add-instructor",
        element: <InstructorCourseAddHomePage />,
      },
      //  {path: "courseIntroVideo", element : <CourseIntroVideo/>},
      //  {path: "courseInfoForm", element : <CourseInfoForm/>},
      { path: "wishlist", element: <InstructorWishlist /> },
      { path: "review", element: <InstructorReviews /> },
      { path: "myQuiz", element: <InstructorMyQuiz /> },
      { path: "mycourses", element: <InstructorCourse /> },
      {
        path: "instructorCourseDetails/:id",
        element: <InstructorCourseDetails />,
      },
      { path: "message", element: <InstructorMessage /> },
      { path: "announcement", element: <InstructorAnnouncement /> },
      { path: "orderhistory", element: <InstructorOrderHistory /> },
      { path: "assignments", element: <InstructorAssignment /> },
      { path: "setting", element: <InstructorSettings /> },
      { path: "logout", element: <InstructorLogout /> },
      { path: "quiz", element: <UploadQuiz /> },
      { path: "quiz-add", element: <AddQuestionsForm /> },
      { path: "quiz-att", element: <StudentQuiz /> },

      { path: "user", element: <User /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminOutlet />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "enrollCourse", element: <AdminCourse /> },
      { path: "adminCourseDetails/:id", element: <AdminCourseDetails /> },
      { path: "courses-add", element: <AdminCourseAdd /> },
      { path: "allCourse", element: <AllCoursesPage /> },
      { path: "message", element: <AdminMessage /> },
      { path: "review", element: <AdminReviews /> },
      { path: "quizAttempt", element: <AdminQuizAttempt /> },
      { path: "category", element: <AdminCategory /> },
      { path: "payment", element: <AdminPayment /> },
      { path: "announcement", element: <Announcement /> },
      { path: "blogs", element: <AdminBlogs /> },
      { path: "blogdetail/:id", element: <AdminBlogDetailPage /> },
      
      { path: "setting", element: <AdminSettings /> },
      { path: "logout", element: <AdminLogout /> },
    ],
  },
  { path: "/admin/login", element: <Login /> },
  { path: "/instructor/signup", element: <InstructorSignup /> },
  { path: "/instructor/login", element: <InstructorLogin /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);
