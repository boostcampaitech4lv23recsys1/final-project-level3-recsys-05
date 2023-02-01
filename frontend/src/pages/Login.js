import Form from "react-bootstrap/Form"; 
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Logo from '../landing/logo.png'
import { useState, useCallback } from 'react'

function Login(){
    const sessionStorage = window.sessionStorage;
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function onSubmit(e) {
        e.preventDefault();

        fetch('http://34.64.87.78:8000/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }).then((res) => {
            if(res.ok) {
                console.log(res.statusText)
                sessionStorage.setItem("loginEmail", email)
                window.open(`#/products`, '_self')
            }
            else {
                alert("아이디 혹은 비밀번호가 틀렸습니다.")
            }
        });
    }

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
            </Container>
        </div>
    );
}

export default Login