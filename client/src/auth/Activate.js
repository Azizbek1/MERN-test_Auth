import jwt_decode from "jwt-decode";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const Activate = () => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });
  const {id} = useParams()
  useEffect(() => {
    var decoded = jwt_decode(id);
    let token = id
    const {name} = decoded
    console.log(decoded);
    if(token) {
        setValues({...values, name, token})
    }
  
  }, [])

  const { token, name} = values
 
  const clickSubmit = (event) =>  {
    event.preventDefault();
    axios({
        method: "POST",
        url: `http://localhost:5000/api/signup-activation`,
        data: {token}
    })
    .then(response => {
        console.log(`ACAUNT ACTIVERION`, response)
        setValues({...values,  show: false})
        toast.success(response.data.message)
    }).catch(error => {
      console.log(`ACAUNT ACTIVERION ERROR`, error.response.data)
     
      toast.error(error.response.data.error)
    })
  };
  
  const activationLink = () => (
      <div>
          <h1 className="text-center p-5">Привет {name}, готов активировать ваш аккаунт? </h1>
          <button className="btn btn-primary" onClick={clickSubmit}>Активировать Акаунт</button>
      </div>
  )

  return (
    <div>
      <ToastContainer/>
      <h1 className="text-center">Активировать акаунт</h1>
    {activationLink()}

    </div>
  );
};

export default Activate;
