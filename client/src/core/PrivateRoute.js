import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuth } from '../auth/Helpers';


function PrivateRoute({ children }) {
    const auth = isAuth();
    console.log(auth);
    return auth ? children : <Navigate to="/sigin" />;
  }

export default PrivateRoute;
