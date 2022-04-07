import React, { Fragment } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { isAuth, sigout } from "../auth/Helpers";

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="javascriptVoid">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>

              {!isAuth() && (
                <Fragment>
                  <li className="nav-item">
                    <Link className="nav-link" to="sigup">
                      Регистрация
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="sigin">
                      Войти
                    </Link>
                  </li>
                </Fragment>
              )}
             
              {isAuth() && (              
                  <li className="nav-item">
                    <Link className="nav-link" to="private">
                      {isAuth().name}
                    </Link>
                  </li>
              
              )}
               {isAuth() && (              
                  <li className="nav-item">
                    <Link onClick={() => {sigout(() => {
                       <Navigate to='/' state={{ from: location }} />
                       })}} className="nav-link" to="sigin">
                      Выход
                    </Link>
                  </li>
              
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">{children}</div>
    </div>
  );
};

export default Layout;
