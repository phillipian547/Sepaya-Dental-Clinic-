import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';

import { useSession, getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { toast } from 'react-toastify';

import Calendar from 'react-calendar';

import { setupDate } from '../../lib/data-helper';

const dateToday = new Date();
dateToday.setDate(dateToday.getDate() + 2);
const year = dateToday.getFullYear();
const month = dateToday.getMonth();
const dayOfTheMonth = dateToday.getDate();

function UserComponent({userId}) {


  const [limit, setLimit] = useState(null);
  const [futureDates, setFutureDates] = useState(null);

  useEffect(() => {
    
    const getLimits = async() => {
      const fetchData = await fetch('/api/limits',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const jsonData = await fetchData.json();
      //console.log(jsonData);
      setLimit(jsonData.data[0].limitValue);
    };

    getLimits();

  }, []);

  useEffect(() => {
    const getFutureDates = async() => {
      const fetchData = await fetch('/api/futurereserve',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const jsonData = await fetchData.json();
      //console.log('JSON data is ', jsonData.data);
      const arrayValues = jsonData.data.map((data) => {
        //console.log(setupDate(data.date));
        return setupDate(data.date);
      }); 

      //console.log('array values is ', arrayValues);
      setFutureDates(arrayValues);
    };

    getFutureDates();

  },[]);


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [specificData, setSpecificData] = useState(null);

  
  useEffect(() => {
    const getUserData = async() => {
      
      try {
        const fetchData = await fetch('/api/getuser/' + userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();
        //console.log('JSON DATA IS ', jsonData);
        setSpecificData(jsonData.data[0]);

      } catch(error) {
        console.log('error is ', error);
      }
      
    };

    getUserData();
  }, []);

  console.log('specific data is ', specificData);


  const [reserveData, setReserveData] = useState({});
  const [recall, setRecall] = useState(false);


  useEffect(() => {
    const getReservations = async() => {
      try {
        const fetchData = await fetch('/api/reservations/' + userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();

        setReserveData(jsonData);
        //console.log(jsonData);
        return jsonData;
       

      } catch(error) {
        console.log(error);
        return error;
      }
    };

    getReservations();
  }, [userId, recall]);



  const [dateValue, onChangeDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const newDateChange = (dateObj) => {

    onChangeDate(dateObj);

    const month = dateObj.getMonth() + 1; 
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const date = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
    setDate(date);

  };

  const disableSunday = ({activeStartDate, date, view }) => date.getDay() === 0;
  const sundayText = ({ activeStartDate, date, view }) => {
    //view === 'month' && date.getDay() === 0 ? <p>It's Sunday!</p> : null

    if(view === 'month' && date.getDay() === 0 ) {
      return ' - Close';
    } else {
      return null;
    }
  };

  const disableDateByLimit = ({activeStartDate, date, view }) => {
    const count = futureDates.filter(item => item === setupDate(date)).length;
    return limit <= count;
  };

  const addReservation = async(event) => {
    event.preventDefault();

    // console.log(date);
    // console.log(time);

    if(date !== '') {

      const reserveData = {
        date: date,
        time: '',
        status: 'pending',
        paid: false,
        userId: userId
      };

      try {
            
        const fetchDataReservation = await fetch('/api/reservations',{
          method: 'POST',
          body: JSON.stringify({...reserveData}),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonDataReserve = await fetchDataReservation.json();
        console.log(jsonDataReserve);

        toast('Added');
        handleClose();
        setRecall(!recall);
      
      } catch(error) {
        console.log(error);
      }
    } else {
      toast('Date and Time are required');
    }


  }



  return (
    <>
      <Head>
        <title>Online Reservation and Appointment Management System</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Row>
          <Col>

       
            <br />
            { 
            specificData && 
            <div>
              <h6><strong>Name:</strong> {specificData.firstName}  {specificData.middleInitial}  {specificData.lastName}</h6>
              <h6><strong>Gender:</strong> {specificData.gender} </h6>
              <h6><strong>Age:</strong> {specificData.age}</h6>
              <h6><strong>Contact Number:</strong> {specificData.contactNumber}</h6>
              <h6><strong>Email:</strong> {specificData.emailAddress}</h6>
              <h6><strong>Address:</strong> {specificData.patientAddress}</h6>
            </div>
            }

            <hr />

            <br />
            <h3>Your Appointment Details</h3>
            <br />

            { reserveData && reserveData.data &&
            <Table striped hover>
              <thead>
                <tr>
                  {/* <th>First Name</th>
                  <th>Last Name</th>
                  <th>Middle Initial</th>
                  <th>Address</th>
                  <th>Contact Number</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Email</th> */}
                  <th>Date</th>
                  <th>Status</th>
                  {/* <th>Action</th> */}

                </tr>
              </thead>
              <tbody>
              {
                reserveData.data.map((el, index) => {
                  return(
                    <tr key={index}>
                      {/* <td>{el.firstName}</td>
                      <td>{el.lastName}</td>
                      <td>{el.middleInitial}</td>
                      <td>{el.patientAddress}</td>
                      <td>{el.contactNumber}</td>
                      <td>{el.gender}</td>
                      <td>{el.age}</td>
                      <td>{el.emailAddress}</td> */}
                      <td>{setupDate(el.date)}</td>
                      <td>{el.status}</td>
                      {/* <td>
                        {
                          el.status === 'approved' &&
                          <Button variant='secondary' href={`/userreserve/${el.reservationId}`}>View Details</Button>
                        }
                      </td> */}
                    </tr>
                  )
                })
              }
            
              </tbody>
            </Table>

            }
            
            <p className='mt-4' style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button onClick={handleShow}>Create new Appointment</Button>
            </p>
            

          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose} size='lg'>

        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Add New Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            {
            // <Form.Group className="mb-3" controlId="formBasicPassword">
            //   <Form.Label>Password</Form.Label>
            //   <Form.Control type="password" placeholder="Password" />
            // </Form.Group>
            }

            <Form.Group className="mb-5">
              <Form.Label>Date</Form.Label>
              <Calendar 
                onChange={newDateChange} 
                value={dateValue} 
                minDate={new Date(year, month, dayOfTheMonth)}
                tileDisabled={disableDateByLimit}
                //tileContent={sundayText}
              />
            </Form.Group>

            {
            // <Form.Group className="mb-3">
            //   <Form.Label>Time</Form.Label>
            //   <select className='form-control' name="time" onChange={(evt) => setTime(evt.target.value)}>
            //     <option value=""></option>
            //     <option value="8-9 AM">8-9 AM</option>
            //     <option value="9-10 AM">9-10 AM</option>
            //     <option value="10-11 AM">10-11 AM</option>
            //     <option value="11-12 AM">11-12 AM</option>
            //     <option value="1-2 PM">1-2 PM</option>
            //     <option value="2-3 PM">2-3 PM</option>
            //     <option value="3-4 PM">3-4 PM</option>
            //     <option value="4-5 PM">4-5 PM</option>
            //   </select>
            // </Form.Group>
            }


            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={addReservation}>
              Add
            </Button>
          </Modal.Footer>
        </Form>

      </Modal>
      
    </>

  )

};


export default UserComponent;