import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from 'styled-components';
import Logo from './thelogo.png'


function Header(props) {

  const [openedDrawer, setOpenedDrawer] = useState(false)
  const history = useHistory();

  function toggleDrawer() {
    setOpenedDrawer(!openedDrawer);
  }

  function changeNav(event) {
    if (openedDrawer) {
      setOpenedDrawer(false);
    }
  }

  function logout() {
    localStorage.clear()
    history.push('/');
    window.location.reload();
  }

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <Link className="navbar-brand" to={props.logined==null? "/" : "/products"} onClick={changeNav}>
            <span className="ms-2 h5"><img src={Logo} style={{width:"30px"}}/> UNZYP</span>
          </Link>

          <div className={"navbar-collapse offcanvas-collapse " + (openedDrawer ? 'open' : '')}>
            <ul className="navbar-nav me-auto mb-lg-0">
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  href="!#"
                  className="nav-link dropdown-toggle"
                  data-toggle="dropdown"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={["fas", "user-alt"]} />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                    {props.logined==null ? 
                      (<li>
                        <Link to="/login" className="dropdown-item" onClick={changeNav}>
                          Login
                        </Link>
                      </li>) :
                      (<li>
                        <Link to={`/mypage/${localStorage.getItem("token")}`} className="dropdown-item" onClick={changeNav}>
                          My Page
                        </Link>
                      </li>)
                    }
                    {props.logined==null ?
                      (<li>
                        <Link to="/register" className="dropdown-item" onClick={changeNav}>
                          Sign Up
                        </Link>
                      </li>) :
                      (<li>
                        <Link to="/" className="dropdown-item" onClick={logout}>
                          Logout
                        </Link>
                      </li>)
                    }
                </ul>
              </li>

              
            </ul>
          </div>

          <div className="d-inline-block d-lg-none">
            <button type="button" className="btn btn-outline-dark">
              <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
              <span className="ms-3 badge rounded-pill bg-dark">0</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
