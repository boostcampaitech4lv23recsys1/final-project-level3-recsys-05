import Form from "react-bootstrap/Form"; 
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Logo from '../landing/unziplogo.png';
import { Link, useHistory } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';
import { useState, useCallback } from 'react';

function Login(){
    const sessionStorage = window.sessionStorage;
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory()

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post("http://34.64.87.78:8000/login", {
            email: email,
            password: password,
          });
          localStorage.setItem("token", response.data);

          history.push('/products');
          window.location.reload();
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
                <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <img src={Logo} height="200" className="mt-3 mb-2"/></div>
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
                <div className="m-3" style={{textAlign: "center", fontSize: "13px"}}>
                    <Link to="/register">회원가입하기</Link>
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
            </Container>
        </div>
    );
}

export default Login