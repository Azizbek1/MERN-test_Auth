import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuth } from "../auth/Helpers";
import { Navigate, useLocation } from "react-router-dom";

const Updade = () => {
  const [values, setValues] = useState({
    role: "",  
    name: "",
    password: "",
    email: "",
    buttonText: "Отправить",
  });

  const {name, password, email, buttonText} = values
  const handleChange = name => event => {
      console.log(event.target.value)
      setValues({...values, [name]: event.target.value})
      
  };
  const clickSubmit = (event) =>  {
    event.preventDefault();
    setValues({...values, buttonText: 'Отправкаааа'})
    axios({
        method: "POST",
        url: `http://localhost:5000/api/signup`,
        data: {name, email, password}
    })
    .then(response => {
        console.log(`SIGNUP SUCCESS`, response)
        setValues({...values, name: '', email: '', password: '', buttonText: 'Отправленоо'})
        toast.success(response.data.message)
    }).catch(error => {
      console.log(`SIGNUP ERROR`, error.response.data)
      setValues({...values, buttonText: "Отправить"});
      toast.error(error.response.data.error)
    })
  };
  const updateForm = () => (
    <form>
      <div className="form-group">
        <label htmlFor="text" className="col-sm-2 control-label text-muted">
          Name
        </label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          placeholder="Name"
        />
      </div>
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
      <h1 className="text-center">Редактировать</h1>
      {updateForm()}
    </div>
  );
};

export default Updade;
