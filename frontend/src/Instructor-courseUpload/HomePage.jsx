import React, { useState } from "react";
import CourseForm from "./CourseForm";
import CourseIntroVideo from "./CourseIntroVideo";
import ModuleForm from "./ModuleForm";
import AdditionalInfo from "./AdditionalInfoForm";
import Overview from "./OverView";
import { ToastContainer } from "react-toastify";
import QuizForm from "./UploadQuiz";
import AddAssignment from "./Assignment";
import InsAnnouncement from "./Announcement";

const InstructorCourseAddHomePage = () => {
  const [courseId, setCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    "Basic Info & Intro Video",
    "Intro Video",
    "Additional Info",
    "Modules",
    "Quiz & Question ",
    "Assignment",
    "Overview",
    "Announcement"
  ];

  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className="p-10 space-y-10">
      {/* Tabs Header */}
      <div className="flex space-x-4 border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            // disabled={index !== 0 && !courseId} // disable other tabs until course is created
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 border-b-2 ${
              activeTab === index
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="mt-6">
        {activeTab === 0 && (
          <div className="space-y-6">
            <CourseForm
              onCourseCreated={(id) => {
                setCourseId(id);
                handleNext(); // go to next tab after course created
              }}
            />
            {/* { <CourseIntroVideo courseId={courseId} />} */}
            {/* {  <CourseIntroVideo courseId={courseId} />} */}
          </div>
        )}
        {activeTab === 1 &&  courseId &&  <CourseIntroVideo courseId={courseId}/>}

        {activeTab === 2 &&   courseId && <AdditionalInfo courseId={courseId} />}

        {activeTab === 3 &&  courseId &&  <ModuleForm courseId={courseId} />}

        {activeTab === 4 &&  courseId &&  <QuizForm courseId={courseId} />}

        {activeTab === 5 && courseId && <AddAssignment courseId={courseId}/>}

        {activeTab === 6 &&  courseId &&  <Overview courseId={courseId} />}

        {activeTab === 7 &&   <InsAnnouncement courseId={courseId} />}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between mt-10 max-w-3xl mx-auto">
        <button
          onClick={handleBack}
          disabled={activeTab === 0}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={
            activeTab === tabs.length - 1 || (!courseId && activeTab !== 0)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default InstructorCourseAddHomePage;
