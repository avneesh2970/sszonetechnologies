import React from "react";

const Heading = ({ title, subTitle, content }) => {
  return (
    <div className="py-10 text-center max-w-2xl mx-auto">
      {title && (
        <p className="text-blue-600 tracking-widest font-medium uppercase mb-2">
          {title}
        </p>
      )}
      {subTitle && (
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {subTitle}
        </h1>
      )}
      {content && (
        <p className="text-gray-600 text-base leading-relaxed">
          {content}
        </p>
      )}
    </div>
  );
};

export default Heading;
