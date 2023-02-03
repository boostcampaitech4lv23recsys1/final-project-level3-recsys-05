import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';	
import { useEffect, useState } from 'react';	
import axios from 'axios';	
import { useParams } from 'react-router-dom';
	
function Mypage() {	
  const params = useParams();
  const [ products, setProducts ] = useState([]);	
  const [ displayProducts, setDisplayProducts ]= useState(3);	
  	
  useEffect(() => {
    console.log(params.itemid)
    axios.get('http://34.64.87.78:8000/wish/' + params.itemid).then((resp) => {
        setProducts([...resp.data])
      }).catch((e) => {
        console.log(e);
      });
  }, [])

  return (	
    <div>	
      {/* jumbotron */}	
      <div class="bg-light p-5 rounded-lg">	
        <h1 class="display-4">마이페이지</h1>	
        {/* <p class="lead">반가워요</p>	 */}
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
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <a class="btn btn-secondary btn" role="button" onClick={() => {
          setDisplayProducts(displayProducts+3)
        }}>더보기</a>
      </div>
    </div>	

  );	
}	
	
function Card(props) {	
  return (	
    <>	
      <div className='col-md-4'>	
        <img src={ props.thepd.image_url } width="100%" />	
        <h3>{ props.thepd.title }</h3>	
        <p>{ props.thepd.review_avg } & { props.thepd.selling_price }</p>	
      </div>	
    </>	
  )	
}	
	
export default Mypage;