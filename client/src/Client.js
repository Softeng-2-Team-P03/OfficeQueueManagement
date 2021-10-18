import 'bootstrap/dist/css/bootstrap.css';
import { Row, Col, Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API';

function Client(props) {

    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingTicket, setLoadingTicket] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [selected, setSelected] = useState('');
    const [ticket, setTicket] = useState('No ticket issued yet');
    const [time, setTime] = useState('No ticket issued yet');

    useEffect(() => {
        API.getServices()
            .then((services) => {
                setServices(services);
                setLoadingServices(false);
                setErrorMessage('');
            })
            .catch(err => {
                setErrorMessage('Error in retrieving the services');
                console.error(err);
            })
    }, []);

    const newTicket = (service) => {
        setLoadingTicket(true);
        API.getTicket(service)
            .then((ticket) => {
                setSelected(service);
                setTicket(ticket.ticketNum);
                setTime(ticket.ticketTime);
                setErrorMessage('');
                setLoadingTicket(false);
            })
            .catch(err => {
                setErrorMessage('Error in issueing ticket');
                console.error(err);
            });
    }


    return (
        <>
            <Row className="below-nav">
                <Col xs="3"></Col>
                <Col xs="6">
                    <h1 className='text-center'>Select the service you are looking for</h1>
                    <br />
                    {loadingServices ? <h3>Loading services <Spinner animation="border" /> </h3>
                        :
                        <Row>
                            <Col xm={{ order: 'last' }}></Col>
                            {services.map((service) =>
                                <>
                                    <Button disabled={loadingTicket} variant="primary" onClick={() => newTicket(service)} >
                                        {service}
                                    </Button>&nbsp;
                                </>
                            )}
                            <Col xm={{ order: 'first' }}></Col>
                        </Row>
                    }
                    <Row>
                        <h4 style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</h4>
                        {loadingTicket && <h4>Creating ticket...</h4>}
                    </Row>
                    <br />
                    <Row>
                        <Col xm={{ order: 'last' }}></Col>
                        <Card style={{ width: '18rem' }}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Servizio selezionato: {selected}</ListGroup.Item>
                                <ListGroup.Item>Ticket number: {ticket}</ListGroup.Item>
                                <ListGroup.Item>Estimated waiting time: {time}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Col xm={{ order: 'first' }}></Col>
                    </Row>
                </Col>
            </Row>


        </>
    );
}

export default Client;

