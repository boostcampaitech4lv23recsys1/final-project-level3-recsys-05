import Form from "react-bootstrap/Form"; 
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Logo from '../landing/logo.png';
import { Link } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';
import { useState, useCallback } from 'react';

function Login(){
    const sessionStorage = window.sessionStorage;
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post("http://34.64.87.78:8000/login", {
            email: email,
            password: password,
          });
          console.log(response.data)
          localStorage.setItem("token", response.data);
          console.log(localStorage.getItem("token"))
          window.location.replace('/#/products');
        } catch (e) {
          alert("ID 혹은 PASSWORD가 틀렸습니다.");
        }
      };


    const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const emailCurrent = e.target.value
        setEmail(emailCurrent)
    }, [])

    const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const pwCurrent = e.target.value
        setPassword(pwCurrent)
    }, [])

    return (
        <div>
            <Container className="panel mt-5 pt-5">
                <img src={Logo} height="70" className="mb-4"/>
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                        <Col sm>
                            <Form.Control type="text" placeholder="이메일" onChange={onChangeEmail}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                        <Col sm>
                            <Form.Control type="password" placeholder="비밀번호" onChange={onChangePassword}/>
                        </Col>
                    </Form.Group>
                    <br/>

                    <div className="d-grid gap-1">
                        <Button variant="secondary" type="submit" onClick={onSubmit}>
                            로그인
                        </Button>
                    </div>
                </Form>
                <div className="mt-3" style={{textAlign: "center", fontSize: "8px"}}>
                    <Link to="/register">회원가입하기</Link>
                </div>
            </Container>
        </div>
    );
}

export default Login