import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';	
import { useState } from 'react';	
import axios from 'axios';	
import product from '../products/Product';
import datas from '../products/dummy.json'
	
function History() {	
  const [ products, setProducts ] = useState(datas.posts);	
  const [ pageIdx, setPageIdx ]= useState(2);	
  	
  console.log(products.posts)

  return (	
    <div>	
      {/* jumbotron */}	
      <div class="bg-light p-5 rounded-lg">	
        <h1 class="display-4">안녕하세요</h1>	
        <p class="lead">반가워요</p>	
        <hr class="my-4" />	
      </div>	
      {/* card contents */}	
      <div className='container'>	
        <div className='row'>	
          {	
            products.map((obj, i) => {	
              return <Card i={i} thepd={obj} />	
            })	
          }	
        </div>
      </div>
      {/* more button */}
      <a class="btn btn-secondary btn" role="button" onClick={() => {
        axios.get('http://localhost:5785/items').then((resp) => {
          console.log([...products])
          setProducts(
            [...products, ...resp.data.posts]
          );
          setPageIdx(pageIdx + 1);
        }).catch((e) => {
          console.log(e);
        });
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
	
export default History;