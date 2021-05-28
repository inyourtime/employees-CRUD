import React, { useState } from 'react'
import Button from "react-bootstrap/Button";
import { Container, Form } from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import "./App.css";

import axios from 'axios'

function App() {

    const [employeeList, setEmployeeList] = useState([])

    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [country, setCountry] = useState('')
    const [position, setPosition] = useState('')
    const [wage, setWage] = useState('')
    const [newWage, setNewWage] = useState('')


    const getEmployees = () => {
        axios.get('/api/employees')
            .then(res => {
                setEmployeeList(res.data)
            })
    }

    const addEmployee = () => {
        axios.post('/api/employee', {
            name: name,
            age: age,
            country: country,
            position: position,
            wage: wage
        }).then(res => {
            console.log(res.data)
        })

        setName('')
        setAge('')
        setCountry('')
        setPosition('')
        setWage('')
    }

    const updateEmployeeWage = (id) => {
        axios.put('/api/update/wage', { wage: newWage, id: id })
            .then(res => {
                setEmployeeList(
                    employeeList.map((val) => {
                        return val.id === id ? {
                            id: val.id,
                            name: val.name,
                            age: val.age,
                            country: val.country,
                            position: val.position,
                            wage: val.newWage
                        } : val;
                    })
                )
            })
    }

    const deleteEmployee = (id) => {
        axios.delete(`/api/delete/${id}`)
            .then(res => {
                setEmployeeList(
                    employeeList.filter((val) => {
                        return val.id !== id
                    })
                )
            })
    }

    return (
        <Container>
            <h1>Employee Information</h1>
            <div className="information">
                <Form action="">
                    <Form.Group controlId="name">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => { setName(e.target.value) }} />
                    </Form.Group>
                    <Form.Group controlId="age">
                        <Form.Label>Age:</Form.Label>
                        <Form.Control type="number" placeholder="Enter age" value={age} onChange={e => { setAge(e.target.value) }} />
                    </Form.Group>
                    <Form.Group controlId="country">
                        <Form.Label>Country:</Form.Label>
                        <Form.Control type="text" placeholder="Enter country" value={country} onChange={e => { setCountry(e.target.value) }} />
                    </Form.Group>
                    <Form.Group controlId="position">
                        <Form.Label>Position:</Form.Label>
                        <Form.Control type="text" placeholder="Enter position" value={position} onChange={e => { setPosition(e.target.value) }} />
                    </Form.Group>
                    <Form.Group controlId="wage">
                        <Form.Label>Wage:</Form.Label>
                        <Form.Control type="number" placeholder="Enter wage" value={wage} onChange={e => { setWage(e.target.value) }} />
                    </Form.Group>
                    <Button className="btn btn-success" onClick={addEmployee}>Add Employee</Button>
                </Form>
            </div>
            <hr />
            <div className="employees">
                <Button className="btn btn-primary" onClick={getEmployees}>Show employees</Button>
                <br /><br />
                {employeeList.map((val, key) => {
                    return (
                        <Card className="employee mb-3" style={{ width: "500px" }}>
                            <Card.Body>
                                <Card.Text>Name: {val.name}</Card.Text>
                                <Card.Text>Age: {val.age}</Card.Text>
                                <Card.Text>Country: {val.country}</Card.Text>
                                <Card.Text>Position: {val.position}</Card.Text>
                                <Card.Text>Wage: {val.wage}</Card.Text>
                                <div className="d-flex">
                                    <Form.Control type="number" onChange={e => { setNewWage(e.target.value) }}></Form.Control>
                                    <Button className="btn btn-warning" onClick={() => { updateEmployeeWage(val.id) }}>Update</Button>
                                    <Button className="btn btn-danger" onClick={() => { deleteEmployee(val.id) }}>Delete</Button>
                                </div>
                            </Card.Body>

                        </Card>

                    )
                })}
            </div>
        </Container>
    );
}

export default App;
