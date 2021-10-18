import 'bootstrap/dist/css/bootstrap.css';
import { Row, Col, Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API';

function Client(props) {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        API.getServices()
            .then((services) => {
                setServices(services);
                setLoading(false);
                setErrorMessage('');
            })
            .catch(err => {
                setErrorMessage('Error in retrieving the services');
                console.error(err);
            })
    }, [])


    return (
        <>
            <Row className="below-nav">
                <Col xs="3"></Col>
                <Col xs="6">
                    <h1>Select the service you are looking for</h1>
                    {loading ? <h3>Loading services <Spinner animation="border" /> </h3>
                        :
                        services.map((service) =>
                            <Row key={service} className="below-nav">
                                <Button disabled={loading} variant="primary" >
                                    {service}
                                </Button>
                            </Row>
                        )
                    }
                    <Row>
                        <h4 style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</h4>
                    </Row>
                    <Row className="below">
                        <Card style={{ width: '18rem' }}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Servizio selezionato:</ListGroup.Item>
                                <ListGroup.Item>Ticket number:</ListGroup.Item>
                                <ListGroup.Item>estimated waiting time:</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Row>
                </Col>
            </Row>


        </>
    );
}

export default Client;

