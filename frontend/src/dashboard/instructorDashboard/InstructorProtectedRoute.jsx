
import React from "react";
import useAuth from "./instructorPage/hooks/useAuth";


const User = () => {
  const { instructor } = useAuth();

  

  return (
    <div>
      {instructor ? (
        <h2>Welcome, {instructor.name} 👋</h2>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};

export default User;
