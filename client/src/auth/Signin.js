import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import {authticate, isAuth} from "./Helpers"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin = () => {
  const [values, setValues] = useState({
    password: "",
    email: "",
    buttonText: "Отправить",
  });

  const { password, email, buttonText} = values
  const handleChange = name => event => {
      console.log(event.target.value)
      setValues({...values, [name]: event.target.value})
  };
  const clickSubmit = (event) =>  {
    event.preventDefault();
    setValues({...values, buttonText: 'Отправкаааа'})
    axios({
        method: "POST",
        url: `http://localhost:5000/api/signin`,
        data: { email, password}
    })
    .then(response => {
      console.log(`SIGNIN SUCCESS`, response)
        // save the response (user, token) localstorage/cokie
        authticate(response, () => {
          setValues({...values,  email: '', password: '', buttonText: 'Отправленоо'})
          toast.success(`привет  ${response.data.user.name},  с возвращением`)
        })
       
    }).catch(error => {
      console.log(`SIGNIN ERROR`, error.response.data)
      setValues({...values, buttonText: "Отправить"});
      toast.error(error.response.data.error)
      toast.error(error.response.data.errors.errors[0].msg)
    })
  };
  const signupForm = () => (
    <form>
      <div className="form-group">
        <label htmlFor="text" className="col-sm-2 control-label text-muted">
          email
        </label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
          placeholder="email"
        />
      </div>
      <div className="form-group">
        <label htmlFor="text" className="col-sm-2 control-label text-muted">
          Password
        </label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control"
          placeholder="password"
        />
      </div>
      <div>
        <button onClick={clickSubmit} className="btn btn-primary">
          {buttonText}
        </button>
      </div>
    </form>
  );
  const location = useLocation();
  return (
    <div>
      <ToastContainer/>
      {isAuth() ?  <Navigate to='/' state={{ from: location }} /> : null}
      <h1 className="text-center">Войти</h1>
      {signupForm()}
    </div>
  );
};

export default Signin;
