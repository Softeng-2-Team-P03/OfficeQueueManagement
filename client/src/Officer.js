import 'bootstrap/dist/css/bootstrap.css';
import { Button, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import { Link, Redirect, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API';

function Officer() {
    const location = useLocation(); //{counterId: counter}

    const [currentTicket, setCurrentTicket] = useState();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (location.state) {
            API.getCurrentTicket(location.state.counterId)
                .then((ticketNum) => {
                    setCurrentTicket(ticketNum);
                    setLoading(false);
                    setErrorMessage('');
                })
                .catch((err) => {
                    setErrorMessage('Error in retrieving ticket being served (' + err.error + ')');
                    console.error(err);
                }
                );
        }
    }, [location.state]);

    const nextClient = () => {
        setLoading(true);
        API.getNextTicket(location.state.counterId)
            .then((ticketNum) => {
                setCurrentTicket(ticketNum);
                setLoading(false);
                setErrorMessage('');
            })
            .catch((err) => {
                setErrorMessage('Error in retrieving next ticket to serve (' + err.error + ')');
                console.error(err);
            }
            );
    }

    return (
        <>
            {!location.state && <Redirect to='/choose' />}
            <Container>
                <Row>
                    <Col xm={{ order: 'last' }}></Col>
                    <h1><b>Counter #{location.state && location.state.counterId}</b></h1>
                    <Col xm={{ order: 'first' }}></Col>
                </Row>
                <Row >
                    <Col xm={{ order: 'last' }}></Col>
                    <ListGroup as="ul">
                        <ListGroup.Item as="li" active>
                            Ticket:&nbsp;
                            {loading ?
                                <Spinner animation="border" size="sm" /> :
                                <b>{currentTicket}</b>
                            }
                        </ListGroup.Item>
                    </ListGroup>
                    <Col xm={{ order: 'first' }}></Col>
                </Row>
                <Row>
                    <Col xm={{ order: 'last' }}></Col>
                    <h4 style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</h4>
                    <Col xm={{ order: 'first' }}></Col>
                </Row>
                <Row>

                    <Col xm={{ order: 'last' }}></Col>
                    <Link to='/choose'>
                        <Button variant="warning">Go Back</Button>
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="warning" onClick={nextClient} disabled={loading}>
                        {loading ?
                            <>Loading <Spinner animation="border" size="sm" /> </>
                            : 'Next Client'}
                    </Button>{' '}
                    <Col xm={{ order: 'first' }}></Col>
                </Row>
            </Container>
        </>
    );
}

export default Officer;