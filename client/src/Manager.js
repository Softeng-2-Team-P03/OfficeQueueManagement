import 'bootstrap/dist/css/bootstrap.css';
import {Table} from "react-bootstrap";
import { useHistory } from "react-router-dom";


function Manager() {

    let history = useHistory();
    let counters = ["1","2","5","4"];

    function OnRowClick () {
        history.push("/counter");
    }
    
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Officer</th>
                    <th>N. Client Served</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {counters.map( (x)=> (
                        <tr>
                            <td>{x}</td>
                            <td>5</td>
                            <td><button onClick={OnRowClick}>
                                Services
                            </button></td>
                        </tr>
                    )
                )}
                </tbody>
            </Table>
            <div>
            </div>
        </div>
    );
}

export default Manager;