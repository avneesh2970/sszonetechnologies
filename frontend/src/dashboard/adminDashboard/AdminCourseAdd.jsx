import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../../courseUpload/HomePage';

const AdminCourseAdd = () => {
  const [courseId, setCourseId] = useState('');

  return (
   
     <Homepage courseId={courseId} setCourseId={setCourseId} />
     
     
    
  );
};

export default AdminCourseAdd;
