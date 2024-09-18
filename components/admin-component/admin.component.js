import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Table, Tabs, Tab } from 'react-bootstrap';

import { useSession, getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { sendEmail } from '../../utils/email/email.util';

import { setupDate } from '../../lib/data-helper';

import Fuse from 'fuse.js';
import exportAsImage from '../../utils/exportAsImage';

const options = {
  includeScore: true,
  keys: ['firstName', 'lastName', 'middleInitial']
};

const newOptions = {
  includeScore: true,
  threshold: 0.0,
  keys: ['firstName', 'lastName', 'middleInitial', 'latestCheck']
};

function AdminComponent() {


  const [limit, setLimit] = useState(null);

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

  const updateLimit = async() => {
    console.log('limit to update is', limit);
    const data = {
      limit: limit
    };

    const fetchUpdateLinmit = await fetch('/api/limits',{
      method: 'PUT',
      body: JSON.stringify({...data}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const jsonDataUpdateLimit = await fetchUpdateLinmit.json();
    console.log('data to update is ', jsonDataUpdateLimit);

    toast("Updated limit");

  };


  const exportRef = useRef();

  const router = useRouter();

  const { data: session, status } = useSession();
  //console.log(session);

  // const { data: session, status } = useSession();
  // if(status === "authenticated") {
  //   console.log(session);
  // }

  // useEffect(()=>{
  //   getSession().then(session => {
  //     if(!session) {
  //       router.push('/');
  //     }
  //   })
  // }, []);

  const [reserveData, setReserveData] = useState([]);

  const [notApprovedData, setNotApprovedData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [paidData, setPaidData] = useState([]);

  const [recall, setRecall] = useState(false);

  const [users, setUsers] = useState([]);

  const [ok, setOk] = useState(false);
  useEffect(() => {
    const getReservations = async() => {
      try {
        const fetchData = await fetch('/api/patients', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();
        console.log(jsonData);


        const notApprovedData = jsonData.data.filter((el, index) => {
          if(el.status === 'pending') {
          

            const theDate = new Date(el.date).setHours(0,0,0,0);
         

            if(startDate && !endDate) {
            
              if(theDate >= startDate) {
                return el;
              }

            } else if(endDate && !startDate) {
              if(theDate <= endDate) {
                return el;
              }
            } else if(startDate && endDate) {

              if(theDate <= endDate && theDate >= startDate) {
                return el;
              }

            } else {
              
              return el;  
            }
            
            
          
          }
        });
        setNotApprovedData(notApprovedData);


        const approvedData = jsonData.data.filter((el, index) => {
          if(el.status === 'approved') {
            return el;
          }
        });
        setApprovedData(approvedData);

      
        const paidData = jsonData.data.filter((el, index) => {
          //if(el.paid) {
            return el;  
          //}
        });

        // const combined = paidData.reduce((acc, obj) => {
        //   const existing = acc.find(item => item.username === obj.username);
        
        //   if (existing) {
        //     // Merge the existing object with the new one
        //     Object.assign(existing, obj);
        //   } else {
        //     acc.push(obj);
        //   }
        
        //   return acc;
        // }, []);

        //const combined = [...new Set(paidData)];

        const combined = paidData.reduce((acc, item) => {
          if (!acc.some(obj => obj.username === item.username)) {
            acc.push(item);
          }
          return acc;
        }, []);
        
        console.log('combined is ', combined);
        setPaidData(combined);
       
        //return jsonData;

      } catch(error) {
        console.log(error);
        //return error;
      }
    };

    getReservations();

    const getUsers = async() => {

      try {
        const fetchData = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();
        
        // const promise = new Promise((resolve, reject) => {

        // });

        const newData = await jsonData.data.map(async(el, index) => {
          //console.log(el);

          try {
            const newFetchData = await fetch('/api/reservations/' + el.userId , {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            const newJsonData = await newFetchData.json();
           //console.log(newJsonData);
            el.latestCheck = setupDate(newJsonData.data[0].date);

            return el;
            
          } catch(error) {
            console.log(error);
            return el;
          }

        
        });

        console.log(newData);
        setPaidData(newData.data);
       
        return await newData;

     
      } catch(error) {
        return error;
      }

    };

    //getUsers();


  }, [recall]);


  const approve = async(event, data) => {
    event.preventDefault();

    data.status = 'approved';

    console.log(data);

    try {
      const fetchData = await fetch('/api/reservations', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const jsonData = await fetchData.json();

      console.log(jsonData);
      toast("approved.");
      const templateParams = {
        from_name: 'From CLinic', 
        to_name: data.firstName + " " + data.middleInitial + " " + data.lastName,
        to_email: data.emailAddress,
        intro_message: "Appointment Status",
        message: "Your appointment is approved " 
      };

      if(data.emailAddress) {
        await sendEmail(templateParams);
        console.log('sent');
      }
     
      setRecall(!recall);
    } catch(error) {
      console.log(error);
      toast("something went wrong.");
    }
  };

  const reject = async(event, data) => {
    event.preventDefault();

    data.date = setupDate(data.date);
   
    try {
      const fetchData = await fetch('/api/reservations', {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const jsonData = await fetchData.json();

      console.log(jsonData);
      toast("Rejected.");
      const templateParams = {
        from_name: 'From CLinic', 
        to_name: data.patientName,
        to_email: data.emailAddress,
        intro_message: "Appointment Status",
        message: "Your appointment is rejected"
      };

      if(data.emailAddress) {
        await sendEmail(templateParams);
      }
      setRecall(!recall);

    } catch(error) {
      console.log(error);
      toast("something went wrong.");
    }
  };

  const [timer, setTimer] = useState(null)
  const notApproveSearch = (event) => {
    const {name, value} = event.target;
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      const fuse = new Fuse(notApprovedData, options)
      const result = fuse.search(value);

      if(value !== '') {
        const newData = [];
        result.forEach(el => {
          newData.push(el.item);
        });
        setNotApprovedData(newData);

      } else {
        setRecall(!recall);
        console.log('empty value');
      }
    }, 500);

    setTimer(newTimer);
  };

  const approveSearch = (event) => {
    const {name, value} = event.target;
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      const fuse = new Fuse(approvedData, options)
      const result = fuse.search(value);

      if(value !== '') {
        const newData = [];
        result.forEach(el => {
          newData.push(el.item);
        });
        
        setApprovedData(newData);

      } else {
        setRecall(!recall);
        console.log('empty value');
      }
    }, 500);

    setTimer(newTimer);
  };

  const paidSearch = (event) => {
    const {name, value} = event.target;
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      const fuse = new Fuse(paidData, newOptions)
      const result = fuse.search(value);

      if(value !== '') {
        const newData = [];
        result.forEach(el => {
          newData.push(el.item);
        });

        console.log(newData);
        
        setPaidData(newData);

      } else {
        setRecall(!recall);
        console.log('empty value');
      }
    }, 500);

    setTimer(newTimer);
  };

  const [startDate, setStartDate] = useState(null);
  const startDateChange = (event) => {
    const value = event.target.value;
    const date = new Date(value).setHours(0,0,0,0);
    setStartDate(date);
    setRecall(!recall);
  };

  const [endDate, setEndDate] = useState(null);
  const endDateChange = (event) => {
    const value = event.target.value;
    const date = new Date(value).setHours(0,0,0,0);
    setEndDate(date);
    setRecall(!recall);
  };

  const [startDateApprove, setStartDateApprove] = useState(null);
  const startDateChangeApprove = (event) => {
    const value = event.target.value;
    const date = new Date(value).setHours(0,0,0,0);
    setStartDate(date);
    setRecall(!recall);
  };

  const [endDateApprove, setEndDateApprove] = useState(null);
  const endDateChangeApprove = (event) => {
    const value = event.target.value;
    const date = new Date(value).setHours(0,0,0,0);
    setEndDate(date);
    setRecall(!recall);
  };


 
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
            <h3>List of Appointments</h3>
            <br />

            { limit !== null &&
            <div className="limitContainer mb-3">
             
              <Row className="align-items-center">
                <Col xs="auto">
                  <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                    Limit
                  </Form.Label>
                  <Form.Control
                    className="mb-2"
                    id="inlineFormInput"
                    placeholder="Limit"
                    type='number'
                    value={limit}
                    onChange={(evt) => setLimit(evt.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button type="submit" className="mb-2" onClick={updateLimit}>
                    Update Limit
                  </Button>
                </Col>
              </Row>
            
            </div>
            }

            <Tabs
              defaultActiveKey="notApproved"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="notApproved" title="Pending Reservations">
                { 
                  notApprovedData &&
                  <>
                    <div className='mb-3 mt-3' style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                      


                      <span>Start Date</span> &nbsp; &nbsp;
                      <input type="date" name='startDate' id='startDate' onChange={startDateChange} />
                      &nbsp; &nbsp;
                      <span>End Date</span> &nbsp; &nbsp;
                      <input type="date" name='endDate' id='endDate' onChange={endDateChange} />
                  
                      &nbsp; &nbsp;
                      <input type="text" className='form-control' style={{width: '300px'}} name='notApproveSearch' placeholder='Search Firstname, LastName, M.I' onChange={notApproveSearch} />
                    
                      </div>
                    
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Middle Initial</th>
                          <th>Address</th>
                          <th>Contact Number</th>
                          <th>Gender</th>
                          <th>Age</th>
                          <th>Email</th>
                          <th>Date</th>
                          {/* <th>Time</th> */}
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                      {
                        notApprovedData.map((el, index) => {
                          return(
                            <tr key={index}>
                              <td>{el.firstName}</td>
                              <td>{el.lastName}</td>
                              <td>{el.middleInitial}</td>
                              
                              <td>{el.patientAddress}</td>
                              <td>{el.contactNumber}</td>
                              <td>{el.gender}</td>
                              <td>{el.age}</td>
                              <td>{el.emailAddress}</td>
                              <td>{setupDate(el.date)}</td>
                              {/* <td>{el.time}</td> */}
                              <td>
                                { el.status === 'pending' &&
                                  <Fragment>
                                  <Button variant="primary" onClick={(evt) => approve(evt, el)}>Approve</Button>{' '}                            
                                  <Button variant="danger" onClick={(evt) => reject(evt, el)}>Reject</Button>
                                  </Fragment>
                                } 
                                { el.status === 'approved' &&
                                  el.status
                                }
                              </td>
                            
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </Table>
                  </>


                }
              </Tab>
              <Tab eventKey="approved" title="Approved Reservations">
                { 
                  approvedData &&
                  <>
                    <div className='mb-3 mt-3' style={{display: 'flex', justifyContent: 'flex-end'}}>
                      <input type="text" className='form-control' style={{width: '300px'}} name='approveSearch' placeholder='Search Firstname, LastName, M.I' onChange={approveSearch} />                                                  
                    </div>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Middle Initial</th>
                          <th>Address</th>
                          <th>Contact Number</th>
                          <th>Gender</th>
                          <th>Age</th>
                          <th>Email</th>
                          <th>Date</th>
                          {/* <th>Time</th> */}
                          <th>Status</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                      {
                        approvedData.map((el, index) => {
                          return(
                            <tr key={index}>
                              <td>{el.firstName}</td>
                              <td>{el.lastName}</td>
                              <td>{el.middleInitial}</td>
                              
                              <td>{el.patientAddress}</td>
                              <td>{el.contactNumber}</td>
                              <td>{el.gender}</td>
                              <td>{el.age}</td>
                              <td>{el.emailAddress}</td>
                              <td>{setupDate(el.date)}</td>
                              {/* <td>{el.time}</td> */}
                              
                              <td>
                                { el.status === 'pending' &&
                                  <Fragment>
                                  <Button variant="primary" onClick={(evt) => approve(evt, el)}>Approve</Button>{' '}                            
                                  <Button variant="danger" onClick={(evt) => reject(evt, el)}>Reject</Button>
                                  </Fragment>
                                } 
                                { el.status === 'approved' &&
                                  el.status
                                }
                              </td>
                              {/* <td><Button href={`/reserve/${el.reservationId}`}>Details</Button></td> */}
                            
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </Table>
                  </>
                }
              </Tab>
              <Tab eventKey="paid" title="Patient Records">
                { 
                  paidData &&
                  <>
                    <div className='mb-3 mt-3' style={{display: 'flex', justifyContent: 'flex-end'}}>
                      <input type="text" className='form-control' style={{width: '300px', marginRight: '20px'}} name='approveSearch' placeholder='Search' onChange={paidSearch} />                                                        
                      <Button onClick={() => exportAsImage(exportRef.current, "test")}>Print</Button>                                          
                    </div>
                    <div className='p-3' ref={exportRef}>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Middle Initial</th>
                            <th>Address</th>
                            <th>Contact Number</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Email</th>
                            {/* <th>Last Appointment</th> */}
                          </tr>
                        </thead>
                        <tbody>
                        {
                          paidData.map((el, index) => {
                            return(
                              <tr key={index} style={{cursor: 'pointer'}} onClick={() => router.push(`/userreservelist/${el.userId}`)}>
                                <td>{el.firstName}</td>
                                <td>{el.lastName}</td>
                                <td>{el.middleInitial}</td>
                                <td>{el.patientAddress}</td>
                                <td>{el.contactNumber}</td>
                                <td>{el.gender}</td>
                                <td>{el.age}</td>
                                <td>{el.emailAddress}</td>
                                {/* <td>{el.latestCheck}</td> */}
                                
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </Table>
                    </div>
                  </>
                }
              </Tab>
            </Tabs>


            
            
          </Col>
        </Row>
      </Container>
      
    </>

  )
  
  

};


export default AdminComponent;