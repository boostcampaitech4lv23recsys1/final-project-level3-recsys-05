import Form from "react-bootstrap/Form"; 
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useState, useCallback } from 'react'
import { alignPropType } from "react-bootstrap/esm/types";
import axios, { AxiosInstance } from 'axios';

function Join(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [username, setUsername] = useState("")
    const [ohouse, setOhouse] = useState("")

    const [emailMessage, setEmailMessage] = useState("")
    const [passwordMessage, setPasswordMessage] = useState("")
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [ohouseMessage, setOhouseMessage] = useState("")

    const [isEmail, setIsEmail] = useState("")
    const [isPassword, setIsPassword] = useState("")
    const [isConfirmPassword, setIsConfirmPassword] = useState("")
    const [isUsername, setIsUsername] = useState("")
    const [numberOhouse, setNumberOhouse] = useState("")

    const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const emailRegex =
          /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        const emailCurrent = e.target.value
        setEmail(emailCurrent)
    
        if (!emailRegex.test(emailCurrent)) {
          setEmailMessage('이메일 형식이 아닙니다.')
          setIsEmail(false)
        } else {
          setEmailMessage('올바른 이메일입니다.')
          setIsEmail(true)
        }
      }, [])

        // 비밀번호
    const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        const passwordCurrent = e.target.value
        setPassword(passwordCurrent)

        if (!passwordRegex.test(passwordCurrent)) {
        setPasswordMessage('숫자+영문자 조합으로 6자리 이상 입력해주세요!')
        setIsPassword(false)
        } else {
        setPasswordMessage('안전한 비밀번호에요 : )')
        setIsPassword(true)
        }
    }, [])

    // 비밀번호 확인
    const onChangePasswordConfirm = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordConfirmCurrent = e.target.value
        setConfirmPassword(passwordConfirmCurrent)

        if (password === passwordConfirmCurrent) {
            setConfirmPasswordMessage('비밀번호를 똑같이 입력했어요 : )')
            setIsConfirmPassword(true)
        } else {
            setConfirmPasswordMessage('비밀번호가 틀려요. 다시 확인해주세요 ㅜ ㅜ')
            setIsConfirmPassword(false)
        }
        },
        [password]
    )

    const onChangeUsername = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
        const usernameCurrent = e.target.value
        setUsername(usernameCurrent)

        if (usernameCurrent.length >1 && usernameCurrent.length < 11) {
            setUsernameMessage('올바른 닉네임입니다.')
            setIsUsername(true)
        } else {
            setUsernameMessage('2자에서 10자 사이로 입력해 주세요')
            setIsUsername(false)
        }
        }, [])

    const onChangeOhouse = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
        const usernameCurrent = e.target.value
        setOhouse(usernameCurrent)

        }, [])

    function onSubmit(e) {
        e.preventDefault();

        const ohouseCheck = /https?:\/\/(www\.)?ohou.se\/users\/([-_a-z0-9]{1,15})/i
        if(ohouseCheck.test(ohouse)) {
            setNumberOhouse(ohouse.replace(/[^0-9]/g, ""))
        }
        else {
            setNumberOhouse("0")
        }

        fetch('http://34.64.87.78:8000/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: confirmPassword,
                username: username,
                ohouse: numberOhouse,
            }),
        }).then((res) => {
            if(res.ok) {
                console.log("ok");
            }
            else {
                alert("중복 Email입니다.")
            }
        });
    }

    return (
        <div>
            <Container className="panel mt-5 pt-5">
                <h4>회원가입</h4>
                <hr></hr>
                <Form>
                    <h5 className="mb-2">이메일</h5>
                    <Form.Group as={Row} className="mb-4" controlId="formBasicEmail">
                        <Col sm>
                            <Form.Control type="email" placeholder="이메일" onChange={onChangeEmail}/>
                        </Col>
                    </Form.Group>

                    <h5>비밀번호</h5>
                    <div className="mb-2" style={{color: '#808080', fontsize: '1rem'}}>영문, 숫자, 특수문자를 포함한 6자 이상의 비밀번호를 입력해주세요.</div>
                    <Form.Group as={Row} className="mb-2" controlId="formPassword">
                        <Col sm>
                            <Form.Control type="password" placeholder="비밀번호" onChange={onChangePassword}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-4" controlId="formConfirmPassword">
                        <Col sm>
                            <Form.Control type="password" placeholder="비밀번호 확인" onChange={onChangePasswordConfirm}/>
                        </Col>
                    </Form.Group>
                    
                    <h5>닉네임</h5>
                    <Form.Group as={Row} className="mb-4" controlId="formUsername">
                        <Col sm>
                            <Form.Control type="text" placeholder="별명 (2~10자)" onChange={onChangeUsername}/>
                        </Col>
                    </Form.Group>

                    <h5>오늘의집 연결</h5>
                    <Form.Group as={Row} className="mb-5" controlId="formMypage">
                        <Col sm>
                            <Form.Control type="text" placeholder="오늘의집 마이페이지 링크" onChange={onChangeOhouse}/>
                        </Col>
                    </Form.Group>
                    

                    <div className="d-grid gap-1">
                        <Button variant="secondary" type="submit" disabled={!(isEmail && isPassword && isConfirmPassword && isUsername)} onClick={onSubmit}>
                            Sign Up
                        </Button>
                    </div>
                    
                    <br/>
                </Form>
            </Container>
        </div>
    );
}

export default Join