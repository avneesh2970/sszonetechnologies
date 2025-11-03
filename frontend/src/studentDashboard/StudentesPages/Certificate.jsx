import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useStudentAuth } from "./studentAuth";
import { getProgress } from "./utils/ProgressStore";

const CertificatePage = () => {
  const location = useLocation();
  const { id } = useParams();
  const { user } = useStudentAuth();

  const [course, setCourse] = useState(location.state || null);

  const certRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: certRef,
    documentTitle: `Certificate-${user?.name}-${course?.title}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 12mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
  });

  useEffect(() => {
    if (!course) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${id}`)
        .then((res) => setCourse(res.data));
    }
  }, [course, id]);

  if (!course) return <p>Loading Certificate...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mt-4">
        <div
          ref={certRef}
          className="bg-white border-2 border-blue-500 w-[800px] p-10 text-center shadow-xl"
        >
          <h1 className="text-4xl font-extrabold mb-3 tracking-wide">
            Certificate of Completion
          </h1>

          <p className="text-lg text-gray-600 mb-6 font-medium">
            This certificate is proudly presented to
          </p>

          <h2 className="text-4xl font-bold text-blue-700 uppercase mb-4">
            {user?.name}
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            for successfully completing the professional training program titled
          </p>

          <h3 className="text-2xl font-semibold text-green-700 mb-6 italic">
            “{course?.title}”
          </h3>

          <p className="text-base text-gray-700 max-w-[600px] mx-auto leading-relaxed">
            This certification acknowledges the dedication, hard work, and
            commitment demonstrated in mastering the skills and knowledge
            covered throughout the course. The participant has shown outstanding
            performance and competence in completing all required modules and
            assessments.
          </p>

          <div className="mt-12 text-sm text-gray-500">
            <p>Authorized Signature</p>
            <p className="border-t border-gray-400 w-40 mx-auto mt-2"></p>
          </div>
        </div>
      </div>
      <div className="text-end">
        <button
          onClick={handlePrint}
          className="no-print px-4 py-2 bg-blue-600 text-white rounded-md "
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default CertificatePage;
