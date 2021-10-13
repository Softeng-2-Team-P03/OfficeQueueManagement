import { React, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import API from './API';

function App() {

  return (
    <Router>
      <Col><h1>Prova titolo!</h1></Col>
    </Router>
  );
}

export default App;
