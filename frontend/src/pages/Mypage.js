import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';	
import { useEffect, useState } from 'react';	
import axios from 'axios';	
	
function Mypage() {	
  const [ products, setProducts ] = useState([]);	
  const [ displayProducts, setDisplayProducts ]= useState(3);	
  	
  useEffect(() => {
    axios.get('http://localhost:5785/jims').then((resp) => {
        setProducts([...resp.data.posts])
      }).catch((e) => {
        console.log(e);
      });
  }, [])

  return (	
    <div>	
      {/* jumbotron */}	
      <div class="bg-light p-5 rounded-lg">	
        <h1 class="display-4">마이페이지입니다</h1>	
        <p class="lead">반가워요</p>	
        <hr class="my-4" />	
      </div>	
      {/* card contents */}	
      <div className='container'>	
        <div className='row'>	
          {	
            products.slice(0, displayProducts).map((obj, i) => {	
              return <Card i={i} thepd={obj} />	
            })	
          }	
        </div>
      </div>
      {/* more button */}
      <a class="btn btn-secondary btn" role="button" onClick={() => {
        setDisplayProducts(displayProducts+3)
      }}>더보기</a>
    </div>	

  );	
}	
	
function Card(props) {	
  return (	
    <>	
      <div className='col-md-4'>	
        <img src={ props.thepd.image } width="100%" />	
        <h3>{ props.thepd.title }</h3>	
        <p>{ props.thepd.star } & { props.thepd.price }</p>	
      </div>	
    </>	
  )	
}	
	
export default Mypage;