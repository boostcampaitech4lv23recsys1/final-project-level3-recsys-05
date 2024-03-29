import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';	
import { useEffect, useState } from 'react';	
import axios from 'axios';	
import { useParams } from 'react-router-dom';
import StarRate from "../products/StarRate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailChart from './DetailChart'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

	
function Mypage() {	
  const params = useParams();
  const [ products, setProducts ] = useState([]);	
  const [ productnos, setProductnos ] = useState([]);
  const [ categoryCnt, setCategoryCnt ] = useState([]);
  const [ oCategoryCnt, setOCategoryCnt] = useState([]);
  	
  useEffect(() => {
    console.log(params.userid)
    axios.get("http://34.64.87.78:8000/wish/" + params.userid)
    .then(response => response.data)
    .then(data => {
      setProducts(data);
    })
    .catch((error) => console.log(error));

    axios.get("http://34.64.87.78:8000/wishes/" + params.userid)
    .then(response => response.data)
    .then(data => {
      axios.get("http://34.64.87.78:8000/username/" + params.userid)
      .then(resp => {
        console.log(resp.data[1]!==0 ? resp.data[1] : -1)
        axios.post('http://115.85.181.95:30003/user_info?user_id=' + (resp.data[1]!==0 ? resp.data[1] : -1).toString(),  data)
        .then( response => response.data)
          .then( datum => {
            setCategoryCnt(datum[0])
            setOCategoryCnt(datum[1])
          })
          .catch( error => console.log(error) );
      })
      .catch( error => console.log(error) );
    })
    .catch((error) => console.log(error));
  }, [])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#BEAED4',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  // '생활용품', '가구', '조명', '데코·식물', '패브릭', '수납·정리', '공구·DIY', '주방용품'

  function CustomizedTables() {
    const rows = [  {category: '생활용품', numbers: categoryCnt[0]},
    {category: '가구', numbers: categoryCnt[1]},
    {category: '조명', numbers: categoryCnt[2]},
    {category: '데코·식물', numbers: categoryCnt[3]},
    {category: '패브릭', numbers: categoryCnt[4]},
    {category: '수납·정리', numbers: categoryCnt[5]},
    {category: '공구·DIY', numbers: categoryCnt[6]},
    {category: '주방용품', numbers: categoryCnt[7]},
    ];
  
    const rows2 = [  {category: '생활용품', numbers: oCategoryCnt[0] , numbers2: categoryCnt[0]},
    {category: '가구', numbers: oCategoryCnt[1], numbers2: categoryCnt[1]},
    {category: '조명', numbers: oCategoryCnt[2], numbers2: categoryCnt[2]},
    {category: '데코·식물', numbers: oCategoryCnt[3], numbers2: categoryCnt[3]},
    {category: '패브릭', numbers: oCategoryCnt[4], numbers2: categoryCnt[4]},
    {category: '수납·정리', numbers: oCategoryCnt[5], numbers2: categoryCnt[5]},
    {category: '공구·DIY', numbers: oCategoryCnt[6], numbers2: categoryCnt[6]},
    {category: '주방용품', numbers: oCategoryCnt[7], numbers2: categoryCnt[7]},
    ];

    console.log(rows)
    
    return oCategoryCnt.reduce((a, b) => a + b, 0)===0 ?  (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>카테고리</StyledTableCell>
              <StyledTableCell align="right">좋아요</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.category}
                </StyledTableCell>
                <StyledTableCell align="right">{row.numbers}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ):
    (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>카테고리</StyledTableCell>
              <StyledTableCell align="right">오늘의 집 찜 목록</StyledTableCell>
              <StyledTableCell align="right">좋아요</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows2.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.category}
                </StyledTableCell>
                <StyledTableCell align="right">{row.numbers}</StyledTableCell>
                <StyledTableCell align="right">{row.numbers2}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (	
    <div>	
      <div class="bg-light p-5 rounded-lg">
        <br/>
        <h1 class="display-4">마이페이지</h1>	
        {/* <p class="lead">반가워요</p>	 */}
        <hr/>	
      </div>	
      <div className="d-flex p-3 m-2 justify-content-center">
          <div className='p-2'><DetailChart cate={categoryCnt} ocate={oCategoryCnt}/></div>
          <div><CustomizedTables/></div>
      </div>
      <div class="p-5"><hr/></div>
      {/* card contents */}	
      <div className='container'>	
      <h2 class="mb-4">찜한 상품이에요</h2>
        <div className='historys'>	
          {	
            products.map((obj, i) => {
              const payload = {
                item_ids: obj.item_id, 
                titles: obj.title, 
                selling_prices: obj.selling_price, 
                star_avgs: obj.review_avg,
                img_urls: obj.image_url,
                brands: obj.brand
              }
              return <Product product={payload}/>	
            })	
          }	
        </div>
      </div>
    </div>	
  );	
}	



function Product(props) {
  var [clicked, setClicked] = useState(true);

  const handleClick = () => {
    const heart = document.getElementById("like"+id).getElementsByTagName("path")[0];
    if(clicked) {
      axios.get("http://34.64.87.78:8000/unwishing/"+ localStorage.getItem("token") + "/" + id);
      heart.setAttribute("d", "M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z");
      setClicked(false);
    } else {
      axios.get("http://34.64.87.78:8000/wishing/"+ localStorage.getItem("token") + "/" + id);
      heart.setAttribute("d", "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z");
      setClicked(true);
    }
  };

  const product = props.product;
  const id = product.item_ids;
  const name = product.titles;
  const price = product.selling_prices;
  const star = product.star_avgs;
  const Image = product.img_urls;
  const brand = product.brands;
  const field = props.field;
  
  return (
      <div className={"card shadow-sm card" + field}>
        <a href={ "#/detail/" + id } className="link" target="blank">
          <img
            className="card-img-top bg-dark cover"
            height="200"
            alt=""
            src={ Image }
            loading="lazy"
          />
        </a>
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate title">
            { name }
          </h5>
          <p className="card-text text-center text-muted mb-0 brand">{ brand }</p>
          <p className="card-text text-center text-muted mb-0 price">{ '￦' + [price].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</p>
          <StarRate className="card-text text-center text-muted mb-0 star" star={ star } id={ id }/>
          <div className="d-grid d-block text-center">
              <FontAwesomeIcon icon={["fas", "heart"]} id={ `like${id}`} onClick={ handleClick } className={"like"}/>
          </div>
        </div>
      </div>
  );
}
	
export default Mypage;