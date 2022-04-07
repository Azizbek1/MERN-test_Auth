import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getCookie, isAuth, sigout, updateUser } from '../auth/Helpers';

const Admin = () => {

    const [values, setValues] = useState({
      name: "",
      password: "",
      email: "",
      role: "",
      buttonText: "Отправить",
    });

    const token = getCookie('token')
    useEffect(() => {
        loadProfile()
    }, [])
    const location = useLocation();
    const loadProfile = () => {
        axios({
            method: "GET",
            url: `http://localhost:5000/api/user/${isAuth()._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }

        })    
        .then(response => {
            console.log(`PROFILE UPDATE`, response)
            const {role, name, email} = response.data
            setValues({...values, role, name, email})
        }).catch(err => {
            console.log(`PROFILE EROR`, err.response.data.error)
            if(err.response.stats === 401) {
                sigout(() => {
                    <Navigate to='/' replace state={{ from: location }} />
                })
            }
        })
    }
    const {name, password, email, buttonText, role} = values
    const handleChange = name => event => {
        console.log(event.target.value)
        setValues({...values, [name]: event.target.value})
        
    };
    const clickSubmit = (event) =>  {
      event.preventDefault();
      setValues({...values, buttonText: 'Отправкаааа'})
      axios({
          method: "PUT",
          url: `http://localhost:5000/api/admin/update`,
          headers: {
            Authorization: `Bearer ${token}`
          },
        data: {name, password},
      })
      .then(response => {
          console.log(`SIGNUP UPDATE`, response)
          updateUser(response, () => {
            setValues({...values, buttonText: 'Отправленоо'})
            toast.success(`Редактированннн!`)
          })
          setValues({...values, buttonText: "Отправить"});
      }).catch(error => {
        console.log(`SIGNUP ERROR`, error.response.data.error)
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
            Role
          </label>
          <input
            onChange={handleChange("name")}
            defaultValue={role}
            type="text"
            className="form-control"
            placeholder="Name"
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="text" className="col-sm-2 control-label text-muted">
            email
          </label>
          <input
            defaultValue={email}
            type="email"
            className="form-control"
            placeholder="email"
            disabled
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
    return (
      <div>
        <ToastContainer/>
        <h1 className="text-center">Редактировать Admin</h1>
        {updateForm()}
      </div>
    );
  };

export default Admin;
