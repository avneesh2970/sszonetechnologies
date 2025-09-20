import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseForm from "./CourseForm";
import CourseIntroVideo from "./CourseIntroVideo";
import ModuleForm from "./ModuleForm";
import LessonForm from "./LessonForm";
import ModuleList from "./ModuleList";
import AdditionalInfo from "./AdditionalInfoForm";
import { Link, useNavigate } from "react-router-dom";
import Overview from "./OverView";

const Homepage = ({ courseId, setCourseId }) => {
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const fetchModules = async () => {
    if (!courseId) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}/full`
      );
      setModules(res.data.modules || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  return (
    <div className="p-10 space-y-10">
      <CourseForm onCourseCreated={setCourseId} />
      {courseId && (
        <>
          <CourseIntroVideo courseId={courseId} />
          <ModuleForm courseId={courseId} onModuleCreated={fetchModules} />
          <ModuleList modules={modules} />
          <LessonForm modules={modules} onLessonAdded={fetchModules} />
          <AdditionalInfo courseId={courseId} />
          <Overview courseId={courseId}/>
          {/* <button
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => navigate(`/course/${courseId}`)}
          >
            View Full Course
          </button>
          <br />

          <Link to="/allCourse" className="text-blue-600 underline">
            View All Courses
          </Link> */}
        </>
      )}
    </div>
  );
};

export default Homepage;
