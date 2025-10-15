// import React, { useState, useEffect } from "react";
// import img1 from "../../../assets/image/img1.png";
// import { Link } from "react-router-dom";
// import { FaBook, FaClock, FaRegStar, FaTimes } from "react-icons/fa";
// import { HiOutlineClock } from "react-icons/hi";
// import axios from "axios";

// const TabButton = ({ label, active, onClick }) => (
//   <button
//     className={`px-4 py-2 font-semibold ${
//       active ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
//     }`}
//     onClick={onClick}
//   >
//     {label}
//   </button>
// );

// const AdminCourse = () => {
//   const [activeTab, setActiveTab] = useState("Published");
//   const [courses, setCourses] = useState([]);

//   const filteredCoursesMain = courses.filter(
//     (course) => course.status === activeTab
//   );

//   // console.log("courses", courses);

//   useEffect(() => {
//     const fetchAllCourses = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`
//           // `${import.meta.env.VITE_BACKEND_URL}/api/courses/all/full`
//         );
//         setCourses(res.data.courses || []);
//         console.log("admin Course " , res.data.courses)
//       } catch (err) {
//         console.error("Error fetching courses", err);
//       }
//     };
//     fetchAllCourses();
//   }, []);

//   return (
//     <>
//       <div className="p-6 font-sans">
//         <h1 className="text-2xl font-bold mb-4">Enroll Courses</h1>
//         <div className="flex space-x-6 border-b pb-2">
//           <TabButton
//             label="Published"
//             active={activeTab === "Published"}
//             onClick={() => setActiveTab("Published")}
//           />
//           <TabButton
//             label="Pending"
//             active={activeTab === "Pending"}
//             onClick={() => setActiveTab("Pending")}
//           />
//           {/* <TabButton
//             label="Draft"
//             active={activeTab === "Draft"}
//             onClick={() => setActiveTab("Draft")}
//           /> */}
//         </div>
//       </div>

//       <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 mt-6 px-4 mb-8">
//         {filteredCoursesMain.length === 0 ? (
//           <p className="col-span-full text-center text-gray-500 text-lg">
//             No courses found for {activeTab}.
//           </p>
//         ) : (
//           filteredCoursesMain.map((course, index) => {
//             // ✅ Average Rating calculation
//             const averageRating =
//               course.reviews && course.reviews.length > 0
//                 ? (
//                     course.reviews.reduce(
//                       (sum, review) => sum + review.rating,
//                       0
//                     ) / course.reviews.length
//                   ).toFixed(1)
//                 : null;

//             return (
//               <div
//                 key={course.id || index}
//                 className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
//               >
//                 {/* Image Container */}
//                 <div className="relative overflow-hidden">
//                   <Link
//                     to={`/admin/adminCourseDetails/${course._id}`}
//                     state={course}
//                   >
//                     <img
//                       src={`${import.meta.env.VITE_BACKEND_URL}${
//                         course.thumbnail
//                       }`}
//                       alt={course.title}
//                       className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </Link>

//                   {/* Duration Badge */}
//                   <div className="absolute top-3 left-3">
//                     <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
//                       <HiOutlineClock className="w-3 h-3" />
//                       {course.additionalInfo?.duration
//                         ? `${course.additionalInfo.duration.hour}h ${course.additionalInfo.duration.minute}m`
//                         : "N/A"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Content Container */}
//                 <div className="px-5 py-3">
//                   {/* Title */}
//                   <Link
//                     to={`/admin/adminCourseDetails/${course._id}`}
//                     state={course}
//                   >
//                     <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
//                       {course.title}
//                     </h3>
//                   </Link>

//                   {/* Description */}
//                   <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
//                     {course.description}
//                   </p>

//                   {/* Stats */}
//                   <div className="flex items-center justify-between mb-2 text-sm">
//                     <div className="flex items-center gap-1 text-gray-500">
//                       <FaBook className="w-3 h-3" />
//                       <span>
//                         {course.modules?.reduce(
//                           (sum, module) => sum + (module.lessons?.length || 0),
//                           0
//                         ) || 0}{" "}
//                         Lessons
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-1">
//                       <FaRegStar className="w-3 h-3 text-amber-400" />
//                       <span className="text-gray-700 font-medium">
//                         {averageRating || "New"}
//                       </span>
//                       {course.reviews && course.reviews.length > 0 && (
//                         <span className="text-gray-400 ml-1">
//                           ({course.reviews.length})
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Price & Action */}
//                   <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//                     <div className="flex items-center gap-2">
//                       <span className="text-xl font-bold text-gray-900">
//                         ₹{course.discountPrice}
//                       </span>
//                       {course.regularPrice &&
//                         course.regularPrice !== course.discountPrice && (
//                           <span className="text-sm text-gray-400 line-through">
//                             ₹{course.regularPrice}
//                           </span>
//                         )}
//                     </div>

//                     <Link
//                       to={`/admin/adminCourseDetails/${course._id}`}
//                       state={course}
//                       className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </>
//   );
// };

// export default AdminCourse;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaRegStar } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";
import axios from "axios";

const TabButton = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      active ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const AdminCourse = () => {
  const [activeTab, setActiveTab] = useState("Published");
  const [courses, setCourses] = useState([]);

  const filteredCoursesMain = courses.filter(
    (course) => course.status === activeTab
  );

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`
        );
        setCourses(res.data.courses || []);
        console.log("admin Course ", res.data.courses);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchAllCourses();
  }, []);

  return (
    <>
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold mb-4">Enroll Courses</h1>
        <div className="flex space-x-6 border-b pb-2">
          <TabButton
            label="Published"
            active={activeTab === "Published"}
            onClick={() => setActiveTab("Published")}
          />
          <TabButton
            label="Pending"
            active={activeTab === "Pending"}
            onClick={() => setActiveTab("Pending")}
          />
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 mt-6 px-4 mb-8">
        {filteredCoursesMain.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No courses found for {activeTab}.
          </p>
        ) : (
          filteredCoursesMain.map((course, index) => {
            const averageRating =
              course.reviews && course.reviews.length > 0
                ? (
                    course.reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / course.reviews.length
                  ).toFixed(1)
                : null;

            return (
              <div
                key={course._id ?? index}
                /* make card a column flex and full height of grid cell */
                className="group bg-white rounded-xl  border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                {/* Image Container (fixed height) */}
                <div className="relative overflow-hidden">
                  <Link
                    to={`/admin/adminCourseDetails/${course._id}`}
                    state={course}
                  >
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
                      alt={course.title}
                      /* keep consistent image height */
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Duration Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
                      <HiOutlineClock className="w-3 h-3" />
                      {course.additionalInfo?.duration
                        ? `${course.additionalInfo.duration.hour}h ${course.additionalInfo.duration.minute}m`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Content Container: make this grow so footer stays at bottom */}
                <div className="px-5 py-3 flex-1 flex flex-col">
                  {/* Title */}
                  <Link
                    to={`/admin/adminCourseDetails/${course._id}`}
                    state={course}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <FaBook className="w-3 h-3" />
                      <span>
                        {course.modules?.reduce(
                          (sum, module) => sum + (module.lessons?.length || 0),
                          0
                        ) || 0}{" "}
                        Lessons
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <FaRegStar className="w-3 h-3 text-amber-400" />
                      <span className="text-gray-700 font-medium">
                        {averageRating || "New"}
                      </span>
                      {course.reviews && course.reviews.length > 0 && (
                        <span className="text-gray-400 ml-1">
                          ({course.reviews.length})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spacer so footer pushes to bottom. Use mt-auto to pin footer */}
                  <div className="mt-auto pt-2 border-t border-gray-100 w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{course.discountPrice}
                      </span>
                      {course.regularPrice &&
                        course.regularPrice !== course.discountPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{course.regularPrice}
                          </span>
                        )}
                    </div>

                    <Link
                      to={`/admin/adminCourseDetails/${course._id}`}
                      state={course}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default AdminCourse;
