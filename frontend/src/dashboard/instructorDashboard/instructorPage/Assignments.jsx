import React from "react";

const assignments = [
  {
    id: 1,
    course: "Speaking Korean for Beginners",
    level: "Fundamental",
    total: "80 Marks",
    obtained: 50,
    status: "PASSED",
  },
  {
    id: 2,
    course: "Speaking Korean for Beginners",
    level: "Fundamental",
    total: "80 Marks",
    obtained: 50,
    status: "FAILED",
  },
  {
    id: 3,
    course: "Speaking Korean for Beginners",
    level: "Fundamental",
    total: "80 Marks",
    obtained: 50,
    status: "PASSED",
  },
  {
    id: 4,
    course: "Speaking Korean for Beginners",
    level: "Fundamental",
    total: "80 Marks",
    obtained: 50,
    status: "FAILED",
  },
  {
    id: 5,
    course: "Speaking Korean for Beginners",
    level: "Fundamental",
    total: "80 Marks",
    obtained: 50,
    status: "PASSED",
  },
  {
    id: 6,
    course: "Speaking Korean for Beginners",
    level: "Fundamental",
    total: "80 Marks",
    obtained: 50,
    status: "FAILED",
  },
];

export default function InstructorAssignment() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Assignments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-4 font-medium">Assignment Name</th>
              <th className="p-4 font-medium">Total Marks</th>
              <th className="p-4 font-medium">Obtained Marks</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 1 ? "bg-blue-50" : ""}
              >
                <td className="p-4">
                  <div className="font-medium">{item.course}</div>
                  <div className="text-gray-500 text-sm">Level: {item.level}</div>
                </td>
                <td className="p-4">{item.total}</td>
                <td className="p-4">{item.obtained}</td>
                <td
                  className="p-4 font-semibold"
                  style={{
                    color: item.status === "PASSED" ? "green" : "red",
                  }}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
