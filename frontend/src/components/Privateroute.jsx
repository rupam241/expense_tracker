import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { currentuser } = useSelector(state => state.user);
  const location = useLocation(); 

  
  if (currentuser?.data) {
    return <Outlet />;
  } else {
   
    return <Navigate to='/signin' state={{ from: location }} />;
  }
}

export default PrivateRoute;
