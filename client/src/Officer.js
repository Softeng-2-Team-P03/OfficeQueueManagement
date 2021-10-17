import 'bootstrap/dist/css/bootstrap.css';
import { Button, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from 'react';
import API from './API';

function Officer() {

    const [currentTicket, setCurrentTicket] = useState();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        API.getCurrentTicket(1) //This should be API.getCurrentTicket(counterId). 
            //CounterId will be retrieved via state location or history. Route guy will do it!
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

    }, []);

    const nextClient = () => {
        setLoading(true);
        API.getNextTicket(1) //This should be API.getCurrentTicket(counterId). 
            //CounterId will be retrieved via state location or history. Route guy will do it!
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
        <Container>
            <Row>
                <Col xm={{ order: 'last' }}></Col>
                <h1><b>Counter #1</b></h1>
                {/* This should be Counter #counterId. 
                CounterId will be retrieved via state location or history. Route guy will do it! */}
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
                <Button variant="warning" onClick={nextClient} disabled={loading}>
                    {loading ?
                        <>Loading <Spinner animation="border" size="sm" /> </>
                        : 'Next Client'}
                </Button>{' '}
                <Col xm={{ order: 'first' }}></Col>
            </Row>
        </Container>

    );
}

export default Officer;