import 'bootstrap/dist/css/bootstrap.css';
import { Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API';

function ChooseCounter(props) {

    const [counters, setCounters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        API.getCounters()
            .then((counters) => {
                setCounters(counters);
                setLoading(false);
                setErrorMessage('');
            })
            .catch(err => {
                setErrorMessage('Error in retrieving the counters');
                console.error(err);
            })
    }, [])


    return (
        <Container>
            <Row>
                <Col xm={{ order: 'last' }}></Col>
                <h1><b>Choose the counter</b></h1>
                <Col xm={{ order: 'first' }}></Col>
            </Row>
            <Row>
                <Col xm={{ order: 'last' }}></Col>
                {loading ?
                    <h3>Loading counters <Spinner animation="border" /> </h3>
                    :
                    <ListGroup>
                        {counters.map(counter =>
                            <Link to={{ pathname: '/officer', state: { counterId: counter } }}>
                                <ListGroup.Item action> Counter #{counter}</ListGroup.Item>
                            </Link>)}
                    </ListGroup>
                }
                <Col xm={{ order: 'first' }}></Col>
            </Row>
            <Row>
                <Col xm={{ order: 'last' }}></Col>
                <h4 style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</h4>
                <Col xm={{ order: 'first' }}></Col>
            </Row>
        </Container>

    );
}

export default ChooseCounter;