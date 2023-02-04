import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import BannerZero from "./unziplogo.png";
import styled from 'styled-components';



function Landing() {
  return (
    <>
      <ScrollToTopOnMount />
      <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}><Logo src={BannerZero}/></div>
        <div className="d-flex justify-content-center">
          <Link to="/login" className="btn btn-primary" replace>
            로그인
          </Link>
      </div>
    </>
  );
}

const Logo = styled.img`
    padding: 16px 0;
    margin-top: 200px;
    width: 50vw;
    align-items: center;
`;
export default Landing;
