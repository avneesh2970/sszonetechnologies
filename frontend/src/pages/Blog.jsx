// import React from "react";
// import bgImage from "../assets/image/blog.jpg";
// import blogimg from "../assets/image/card.jpg";
// import BlogCard from "../componant/BlogCard";
// import { useNavigate } from "react-router-dom";

// export const Blog = () => {
//   const navigate = useNavigate();

//   const handleBlogClick = (blog) => {
//     navigate(`/blogs/${blog.id}`, {
//       state: { blogData: blog, allBlogs: blogData },
//     });
//   };

//   const blogData = [
//     {
//       id: 1,
//       title: "Introduction to JavaScript for the Beginner",
//       description:
//         "Learn the fundamentals of JavaScript from scratch and start building interactive web pages...",
//       date: "10 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     {
//       id: 2,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     {
//       id: 3,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     {
//       id: 4,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//       image: blogimg,
//     },
//     {
//       id: 5,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     {
//       id: 6,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     {
//       id: 7,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     {
//       id: 8,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     {
//       id: 9,
//       title: "Mastering React Hooks",
//       description:
//         "Dive deep into React Hooks and learn how to manage state and side effects in functional components...",
//       date: "18 Apr, 2025",
//       image: blogimg,
//       about:
//         "JavaScript is a versatile programming language that powers the web. In this blog, we will explore the basics of JavaScript, including variables, data types, functions, and control structures. By the end of this article, you will have a solid foundation to start your journey into web development.",
//     },
//     // Add more entries as needed
//   ];

//   return (
//     <>
//       <div
//         className="h-[60vh] w-full bg-cover bg-center flex items-center max-w-screen-2xl mx-auto"
//         style={{ backgroundImage: `url(${bgImage})` }}
//       >
//         <div className=" p-8 rounded-lg  text-black md:w-1/2 w-full">
//           <h1 className="md:text-5xl text-3xl font-bold mb-4">Blog</h1>
//           <p className="md:text-lg text-sm leading-relaxed">
//             Discover helpful articles, expert tips, and the latest trends in
//             online learning. Stay informed and inspired as you grow your skills
//             and career.
//           </p>
//         </div>
//       </div>
//       <div className="flex flex-col items-center py-6 gap-6 justify-center text-center  ">
//         <div>
//           <h3 className="text-2xl text-blue-700 tracking-wider font-bold">
//             Blog
//           </h3>
//           <h1 className="md:text-4xl text-2xl  font-bold tracking-wide">
//             Ideas That Inspire Learning
//           </h1>
//           <p className="mt-3 md:p-0 p-2">
//             Stay updated with the latest insights, tips, and trends from our
//             expert blog posts.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10 max-w-screen-2xl mx-auto">
//           {blogData.map((blog) => (
//             <BlogCard
//               key={blog.id}
//               blog={blog}
//               handleBlogClick={handleBlogClick}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Blog;

import React, { useEffect, useState } from "react";
import bgImage from "../assets/image/blog.jpg";
import blogimg from "../assets/image/card.jpg";
import BlogCard from "../componant/BlogCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Heading from "./Heading";

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`
      );
      setBlogs(res.data);
      // toast.success("Successfully fetch Blogs");
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // toast.error("Failed to get Blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        className="h-[60vh] w-full bg-cover bg-center flex items-center max-w-screen-2xl mx-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className=" p-8 rounded-lg  text-black md:w-1/2 w-full">
          <h1 className="md:text-5xl text-3xl font-bold mb-4">Blog</h1>
          <p className="md:text-lg text-sm leading-relaxed">
            Discover helpful articles, expert tips, and the latest trends in
            online learning. Stay informed and inspired as you grow your skills
            and career.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center py-6  justify-center   ">
        <BlogCard />
      </div>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default Blog;
