import { useSession } from "next-auth/react";
import GeneralLayout from "../../components/layouts/generallayout";
import { useRouter } from "next/router";
import { Container, Row, Col, Form, Button, Table, FloatingLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import logo from '../../images/logo2.png';
import Image from "next/image";

import exportAsImage from '../../utils/exportAsImage';

const setupDate = (dateString) => {
  const dateObj = new Date(dateString);
  //console.log(dateObj);

  const month = dateObj.getMonth() + 1; 
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const date = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);

  return date;

};

let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

const dateToday = mm + '/' + dd + '/' + yyyy;

function UserReserveList() {
  
  const router = useRouter();
  const userId = router.query.userId;
  console.log(userId);

  const [recall, setRecall] = useState(false);
  const [reserveData, setReserveData] = useState([]);

  const [userData, setUserData] = useState([]);

  useEffect(()=>{

    const getReservations = async() => {
      try {
        const fetchData = await fetch('/api/users/' + userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();

        setReserveData(jsonData.data);
        //console.log(jsonData);
        return jsonData;
       

      } catch(error) {
        console.log(error);
        return error;
      }
    };

    getReservations();

    const getUser = async() => {
      try {
        const fetchData = await fetch('/api/users/' + userId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();

        setUserData(jsonData.data);
        console.log(jsonData);
        return jsonData;
       

      } catch(error) {
        console.log(error);
        return error;
      }
    };

    getUser();


  }, [recall, userId])




  if(userId && userData.length) {


    return (  
      <>
        <Container>
          <Row>
            <Col>

              <p className="text-end"><Link href="/admin">&#x2190; Go back</Link></p>

              <h3>Patient Details</h3>
              
              <div className="detailsGroup">
                <p><strong>Name:</strong> {userData[0].firstName} {userData[0].middleInitial} {userData[0].lastName}</p>                       
                <p><strong>Username:</strong> {userData[0].username}</p>
                <p><strong>Password:</strong> {userData[0].passwordText}</p>
              </div>
              
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    {/* <th>Time</th> */}
                    {/* <th>Diagnosis</th>
                    <th>Prescription</th> */}
                    <th>Status</th>
                    {/* <th>Payment</th> */}
                   
                  </tr>
                </thead>
                <tbody>
                  {
                    reserveData.map((el, index) => {
                      return(
                        <tr key={index}>
                          <td>{setupDate(el.date)}</td>
                          {/* <td>{el.time}</td> */}
                          {/* <td>{el.diagnosis}</td>
                          <td>{el.prescription}</td> */}
                          <td>{el.status}</td>
                          {/* <td>{el.paid ? 'Paid' : 'Not Paid'}</td> */}
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
  
            </Col>
          </Row>
        </Container>
  
      </>
    )


  }
  
   
}


UserReserveList.layout = GeneralLayout;
export default UserReserveList;