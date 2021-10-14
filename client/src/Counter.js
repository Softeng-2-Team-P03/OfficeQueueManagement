import 'bootstrap/dist/css/bootstrap.css';
import {Table} from "react-bootstrap";


function Counter() {
    return (
        <div>
            <h3>
                Sportello 1
            </h3>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Tipo Servizio</th>
                    <th>N. Clienti Serviti</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>34</td>
                </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default Counter;