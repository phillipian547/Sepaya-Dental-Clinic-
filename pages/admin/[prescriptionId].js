import { useSession } from "next-auth/react";
import GeneralLayout from "../../components/layouts/generallayout";
import { useRouter } from "next/router";
import { Container, Row, Col, Form, Button, Table, FloatingLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";


const defaultFormFields = {
  'prescription': '',
  'userId': ''
}

function User() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const prescriptionId = router.query.prescriptionId;


  const [formFields, setFormFields] = useState(defaultFormFields);
  const { prescription, userId } = formFields;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({...formFields, [name]: value});
  };

  useEffect(() => {
   
    const getPrescriptions = async() => {
      try {
        const fetchData = await fetch('/api/userprescriptions', {
          method: 'POST',
          body: JSON.stringify({prescriptionId: prescriptionId}),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();
      
        const prescription = jsonData.data[0].prescription;
        const userId = jsonData.data[0].userId;

        setFormFields({...formFields, ['prescription']: prescription, 'userId': userId});

        return jsonData;
      } catch(error) {
        console.log(error);
        return error;
      }
    };

    if(prescriptionId) {  
      getPrescriptions();
    }
    
    
  }, [prescriptionId]);
  
  
  const updatePrescription = async(event) => {
    event.preventDefault();

    try {
      const fetchData = await fetch('/api/userprescriptions', {
        method: 'PUT',
        body: JSON.stringify({prescription: prescription, 'prescriptionId': prescriptionId}),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const jsonData = await fetchData.json();
      
      console.log(jsonData);
      toast("Updated prescription");
      //return jsonData;
    } catch(error) {
      console.log(error);
      //return error;
    }

  };

  console.log('Hello world');
  if(session && prescriptionId) {

    if(session.user.role === 'admin') {
      
      return (
        <>
          <Container>
            <Row>
              <Col>
              <Form>
                        
              <Form.Group className="mb-3 inline-group" controlId="prescription">
                <Form.Label className='label'>Prescription:</Form.Label>
               
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  style={{ height: '100px' }}
                  name="prescription"
                  value={prescription}
                  onChange={handleChange}
                />
              
              
              </Form.Group>
    
            
              <div className="submit-button-container">
                <Button size='sm' className='btn-primary' type="button" onClick={updatePrescription}>
                  Update
                </Button>
              </div>
            
            </Form>
              </Col>
            </Row>
          </Container>
      
        </>
      )

    } // end another if 
   
  } // end if 
 

};


User.layout = GeneralLayout;
export default User;