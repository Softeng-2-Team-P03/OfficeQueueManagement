import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import './LoginComponent.css';

function LoginComponent(props) {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            props.userLoginCallback(email, password);
        }
        setValidated(true);

    }
    return (

        <div className="center-block">

            <Form noValidate validated={validated} onSubmit={handleLogin} className="w-50">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control required type="email" placeholder="Email" onChange={ev => setEmail(ev.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email.
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control required type="password" placeholder="Password" minLength="8" maxLength="20" onChange={ev => setPassword(ev.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please enter a password between 8 and 20 characters.
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Text className={"mb-3 "+props.message.type}>{props.message.msg}</Form.Text>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    );
}

export { LoginComponent };
