import { Outlet, Route, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import "./App.css";
import Navbar from "./componant/Navbar";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Footer from "./componant/Footer";
import AboutUs from "./pages/AboutUs";
import CourseDetails from "./pages/courseDetails";
import { ToastContainer } from "react-toastify";

function App() {
  
  return (
    <>
      <Navbar  />
      <Outlet/>
      <ToastContainer autoClose={1000} />
      <Footer />
      
    </>
  );
}

export default App;
