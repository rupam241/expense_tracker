import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { currentuser, isFetching } = useSelector((state) => state.user);  // Destructure isFetching as well
  const location = useLocation();

 
  if (currentuser?.data) {
    return <Outlet />;
  } else {
    return <Navigate to='/signin' state={{ from: location }} />;
  }
}

export default PrivateRoute;
