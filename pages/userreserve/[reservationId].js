import { useSession } from "next-auth/react";
import GeneralLayout from "../../components/layouts/generallayout";
import { useRouter } from "next/router";
import { Container, Row, Col, Form, Button, Table, FloatingLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";

import logo from '../../images/logo2.png';
import Image from "next/image";

import exportAsImage from '../../utils/exportAsImage';


let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

const dateToday = mm + '/' + dd + '/' + yyyy;

function SpecificReservation() {
  
  const exportRef = useRef();
  
  const router = useRouter();
  const { data: session, status } = useSession();
  const reservationId = router.query.reservationId;

  const [reserveData, setReserveData] = useState([]);

  const [prescription, setPrescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [paid, setPaid] = useState(false);

  useEffect(()=>{
    const getReservation = async() => {
      try {
        const fetchData = await fetch('/api/reservation/' + reservationId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();
        console.log(jsonData);

        setReserveData(jsonData.data);
        setPrescription(jsonData.data[0].prescription);
        setDiagnosis(jsonData.data[0].diagnosis);
        setPaid(jsonData.data[0].paid);

        return jsonData;
      } catch(error) {
        console.log(error);
        return error;
      }
    };

    if(reservationId) {
      getReservation();
    }

    
  },[reservationId]);

  const updateStatus = async(evt) => {
    evt.preventDefault();

    console.log(prescription);
    console.log(diagnosis);
    console.log(paid);
    if(prescription !== '' && diagnosis !== '' ) {
      
      try {
        const fetchData = await fetch('/api/reservation/' + reservationId, {
          method: 'PUT',
          body: JSON.stringify({prescription: prescription, diagnosis: diagnosis, paid: paid}),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();
        console.log(jsonData);

        toast('Saved');

        return jsonData;
      } catch(error) {
        console.log(error);
        return error;
      }




    } else {
      toast('Diagnosis and Prescription are required.');
    }
  }

  return (  
    <>
      <Container>
        <Row>
          <Col>

            {
              reserveData.length > 0 && 
              <>
            

                <p><strong>Prescription</strong></p>
                <p>{prescription}</p>
                
               
              </>
            }



          </Col>
        </Row>
      </Container>

    </>
  )
   
}


SpecificReservation.layout = GeneralLayout;
export default SpecificReservation;