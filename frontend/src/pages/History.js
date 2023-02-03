import { useState } from 'react';	
import axios from 'axios';	
import styled from 'styled-components';
import checkimg from './check.jpeg';


function History() {	
  const [ products, setProducts ] = useState([265527, 456986]);	
  const [ counter, setCounter ]= useState(0);	
  const [ chosenItemIds, setChosenItemIds ] = useState([]);

  const userChoose = (itemId) => {
    if (chosenItemIds.includes(itemId)) {
      setChosenItemIds(chosenItemIds.filter((id) => id !== itemId));
    } 
    else {
      setChosenItemIds([...chosenItemIds, itemId]);
    }  
    console.log(chosenItemIds)
  };

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
            products.map((obj, _) => {	
              return <Card pd_number={obj} onClick={userChoose}/>	
            })	
          }	
        </div>
      </div>
      {/* more button */}
      <div style={{alignItems: 'center', justifyContent: 'center'}}>
      <a class="btn btn-secondary btn" style={{backgroundColor: "red"}} role="button" onClick={() => {
        axios.get('http://34.64.87.78:8000/abcd').then((resp) => {
          console.log(resp.data)
          setProducts(
            [...products, ...resp.data]
          );
        }).catch((e) => {
          console.log(e);
        });
      }}>더보기</a>
      <a class="btn btn-secondary btn" role="button" onClick={() => {
        axios.post('modelserver', {chosenItemIds}).then((resp) => {
          console.log('gogo')
        }).catch((e) => {
          console.log(e);
        });
      }}>제출하기</a>
      </div>
    </div>	
  );	
}	
	
function Card(props) {
  const [ title, setTitle ] = useState("")
  const [ image, setImage ] = useState("")
  const [ star, setStar ] = useState(0)
  const [ price, setPrice ] = useState(0)
  const [ isVisible, setIsVisible ] = useState(false)

  const handleClick = () => {
    setIsVisible(!isVisible)
    props.onClick(props.pd_number)
  }

  axios.get('http://34.64.87.78:8000/item/' + props.pd_number).then((resp) => {
      setTitle(resp.data.title)
      setImage(resp.data.image_url)
      setStar(resp.data.review_avg)
      setPrice(resp.data.selling_price)
      return 0;
  }).catch((e) => {
    console.log(e);
  });

  return (	
    <>	
      <div className='col-md-4' style={{position: 'relative'}}>	
        <img src={ image } width="100%"/>
        <img src={ checkimg } width="100%" onClick={handleClick} style={{position: 'absolute', top: 0, left: 0, opacity: isVisible ? 0.5:0, cursor: 'pointer'}}/>
        <h3>{ title }</h3>	
        <p>{ star } & { price }</p>	
      </div>	
    </>	
  )	
}	

const checkImage = styled.div`
  visible: hidden;
  opacity: 0.33;
`;

const itemImage = styled.div`
  width: 10px;
  height: 20px;
`;

export default History;