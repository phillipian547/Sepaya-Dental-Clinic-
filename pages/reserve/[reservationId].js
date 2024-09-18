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
                <div className="prescriptionContainer" ref={exportRef}>
                  <div className="inner">
                    
                    <div className="topInner">
                      

                      <div>
                        <h2>DR. REY C. TALLADOR MEDICAL CLINIC</h2>     
                        <p>General Medicine/Pediatrics</p>       
                        <p>Aquino Nobleza Street, Janiuay, Iloilo</p>      
                        <p>Jehca Complex Balabag, Pavia, Iloilo</p>
                      </div>
                    </div>

                    <div className="half mt-4">
                      <p>Name: <span>{reserveData[0].firstName} {reserveData[0].middleInitial} {reserveData[0].lastName}</span></p>
                      <p>Date: <span>{dateToday}</span></p>
                    </div>

                    <div className="half">
                      <p>Address: <span>{reserveData[0].patientAddress}</span></p>
                      <div>
                        <p>Sex: <span>{reserveData[0].gender}</span></p>
                        <p>Age: <span>{reserveData[0].age}</span></p>
                      </div>
                    </div>

                    <div className="textareaContainer">
                      <h2>Rx</h2>
                      <textarea className="form-control" name="prescription" value={prescription} onChange={(evt) => setPrescription(evt.target.value)} id="prescription" cols="30" rows="10"></textarea>
                    </div>

                    <div className="extraDetailsContainer">
                      <div className="extraDetails">
                        <p>LICENSE NO: <span>60267</span></p>
                        <p>PTR NO.: <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
                        <p>S2 NO.: <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
                      </div>
                    </div>


                  </div>                
                </div>

                <div className="diagnosisContainer">
                  <div className="mb-3">
                    <p>Diagnosis</p>
                    <textarea name="diagnosis" id="diagnosis" value={diagnosis} onChange={(evt) => setDiagnosis(evt.target.value)} className="form-control" cols="30" rows="10"></textarea>
                  </div>

                
                </div>


                <div className="paymentContainer">
                  <p>Payment Status</p>
                  <select name="paid" id="paid" value={paid} onChange={(evt) => setPaid(evt.target.value)} className="form-control">
                    <option value="0">Not Paid</option>
                    <option value="1">Paid</option>
                  </select>
                </div>

                <Button style={{marginRight: '15px'}} variant="secondary" onClick={() => exportAsImage(exportRef.current, "test")}>Print Prescription</Button>
                <Button onClick={updateStatus}>Save</Button>
                
               
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