import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuth } from '../auth/Helpers';


function AdminRouter({ children }) {
    return isAuth() && isAuth().role === 'admin' ? children : <Navigate to="/sigin" />;
  }

export default AdminRouter;
