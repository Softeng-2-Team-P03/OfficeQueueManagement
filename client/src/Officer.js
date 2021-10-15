import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, ListGroup, Row, Table} from "react-bootstrap";

function Officer() {
    return (


        <Container>
            <Row>
                <Col xm={{ order: 'last' }}></Col>
                <h1>Client to serve</h1>
                <Col xm={{ order: 'first' }}></Col>
            </Row>
            <Row >
                <Col xm={{ order: 'last' }}></Col>
                <ListGroup as="ul">
                    <ListGroup.Item as="li" active>
                        Ticket Value: Value
                    </ListGroup.Item>
                    <ListGroup.Item as="li">Service_ID: ID</ListGroup.Item>
                </ListGroup>
                <Col xm={{ order: 'first' }}></Col>
            </Row>
            <Row>
                <Col xm={{ order: 'last' }}></Col>
                <h1></h1>
                <Col xm={{ order: 'first' }}></Col>
            </Row>
            <Row>
                <Col xm={{ order: 'last' }}></Col>
                <Button variant="warning">Next Client</Button>{' '}
                <Col xm={{ order: 'first' }}></Col>
            </Row>
        </Container>



    );
}

export default Officer;