import React from 'react';
import { FaHeart, FaStar, FaBook, FaClock } from 'react-icons/fa';
import img from '../../../assets/image/img1.png'

const InstructorWishlist = () => {
  const courses = [
    {
      id: 1,
      title: 'Learning JavaScript With Imagination',
      author: 'Wilson',
      image: img, // Replace with your image path
      category: 'Development',
      rating: 4.2,
      progress: 10,
    },
    {
      id: 2,
      title: 'Learning JavaScript With Imagination',
      author: 'Wilson',
      image: img,
      category: 'Development',
      rating: 4.2,
      progress: 50,
    },
    {
      id: 3,
      title: 'Learning JavaScript With Imagination',
      author: 'Wilson',
      image: img,
      category: 'Development',
      rating: 4.2,
      progress: 88,
    },
  ];

  return (
    <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-4"
        >
          {/* Image Section */}
          <div className="relative">
            <img src={course.image} alt={course.title} className="rounded-lg w-full h-44 object-cover" />
            <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow text-red-500">
              <FaHeart />
            </div>
          </div>

          {/* Category Tag */}
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full w-max">
            {course.category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>

          {/* Author Info */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <img src={img} alt={course.author} className="w-6 h-6 rounded-full" />
            <span>{course.author}</span>
            <span className="flex items-center gap-1 ml-auto">
              <FaStar className="text-yellow-500" /> 
              <span>({course.rating} Reviews)</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm text-gray-500">Complete</p>
              <p className="text-sm text-gray-600">{course.progress}%</p>
            </div>
            <input
              type="range"
              className="w-full accent-green-500"
              value={course.progress}
              readOnly
            />
          </div>

          {/* Footer Info */}
          <div className="flex justify-between text-gray-500 text-sm mt-2">
            <span className="flex items-center gap-1">
              <FaBook /> 23 Lessons
            </span>
            <span className="flex items-center gap-1">
              <FaClock /> 5 Weeks
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>  );
};

export default InstructorWishlist;
