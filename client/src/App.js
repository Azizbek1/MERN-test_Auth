import React from "react";
import Layout from "./core/Layout";
// , Routes, Navigate
import { Route, Routes } from "react-router-dom";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import Activate from "./auth/Activate";
import Private from "./core/Private";
import Updade from "./auth/Updade";
import Noutfound from "./core/NoutFound";
import PrivateRoute from "./core/PrivateRoute";
import Admin from "./core/Admin";
import AdminRouter from "./auth/AdminRouter";

const App = () => {
  return (
    <div>
      <Layout />
      <div className="container">
        <h1>React</h1>
        <Routes>
          <Route path="/sigup" element={<Signup />} />
          <Route path="/sigin" element={<Signin />} />
          <Route path="/auth/activate/:id" element={<Activate />} />
          <Route path="/update" element={<Updade />} />
          <Route path="/admin" element={ <AdminRouter> <Admin /> </AdminRouter>  } />
          <Route path="/private" element={<PrivateRoute>  <Private/>  </PrivateRoute>} />
          <Route path="*" element={<Noutfound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
