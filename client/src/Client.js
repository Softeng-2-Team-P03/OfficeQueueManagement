import 'bootstrap/dist/css/bootstrap.css';
import { Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';
import { useState } from 'react';



function Client() {
    const [selected, setSelected] = useState("");
    let services = ["Shipping", "Withdrawal", "Deposit", "SPID"];

    const handleSubmit = (event) => {

        event.preventDefault();

        setSelected(true);



    };


    return (
        <>
            <Row className="below-nav">
                <Col xs="3"></Col>
                <Col xs="6">
                    <h1>Select the service you are looking for</h1>
                    <Form onSubmit={handleSubmit}>

                        {
                            services.map((service) =>
                                <Row key={service} className="below-nav">
                                    <Button type="submit" className={selected ? "disabled" : ""} variant="primary" >
                                        {service}
                                    </Button>
                                </Row>
                            )
                        }
                    </Form>
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

