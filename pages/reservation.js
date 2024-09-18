import React from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";

import GeneralLayout from '../components/layouts/generallayout';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import doctorImage from "../images/doctor.jpg";
import Image from 'next/image';

import Calendar from 'react-calendar';
import NonSSRWrapper from '../components/nonssr/nonssr.component';
import { hashPassword } from '../lib/data-helper';
import { toast } from 'react-toastify';
import { sendEmail } from '../utils/email/email.util';
import { setupDate } from '../lib/data-helper';


const defaultFormFields = {
  username: '',
  password: ''
};


const defaultReserveFormFields = {
  firstName: '',
  lastName: '',
  middleInitial: '',
  address: '',
  gender: '', 
  age: '',
  contactNumber: '',
  email: '',
  date: '',
  time: ''
};


const dateToday = new Date();
//dateToday.setDate(dateToday.getDate() + 2);
const year = dateToday.getFullYear();
const month = dateToday.getMonth();
const dayOfTheMonth = dateToday.getDate();


const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


function Home() {

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



  const router = useRouter();

  // below is for fields

  const [reserveFormFields, setDefaultReserveFormFields] = useState(defaultReserveFormFields);
  const { firstName, lastName, middleInitial, gender, age, address, contactNumber,  email, date, time } = reserveFormFields;

  const clearFields = (event) => {
    event.preventDefault();

    setDefaultReserveFormFields(defaultReserveFormFields);
    onChangeDate(null);
    toast('Cleared Reservation Fields');
  };

  const handleReserveFormInputsChange = (event) => {
    const { name, value } = event.target;
    setDefaultReserveFormFields({...reserveFormFields, [name]: value});
  };

  const [dateValue, onChangeDate] = useState(new Date());

  const newDateChange = (dateObj) => {
   // console.log(event)
   onChangeDate(dateObj);

    const month = dateObj.getMonth() + 1; 
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    const date = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);

    setDefaultReserveFormFields({...reserveFormFields, ['date']: date});
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
    //console.log('active start date is ', activeStartDate);

    // console.log('date is ', setupDate(date));
    // console.log('limit is ', limit);
    // console.log('future dates is ', futureDates);

    //console.log('view is ', view);
    const count = futureDates.filter(item => item === setupDate(date)).length;

    return limit <= count;
    
  };


  const doReserve = async(event) => {
    event.preventDefault();

    //console.log(reserveFormFields);
    if(firstName != '' && lastName != '' && middleInitial != '' && address != '' && contactNumber != '' && gender != '' && age != '' && date != '' && email != '') {                                         
      
      const pass = makeid(7);
      const data = {
        username: makeid(6),
        password: await hashPassword(pass),
        passwordText: pass,
        role: 'user',
        firstName: firstName,
        lastName: lastName,
        middleInitial: middleInitial,
        patientAddress: address,
        contactNumber: contactNumber,
        gender: gender, 
        age: age,
        emailAddress: email,
      };

      console.log('data is', data);

      try {
        const fetchData = await fetch('/api/patients',{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jsonData = await fetchData.json();
        console.log(jsonData);

        const userId = jsonData.data.insertId;

        const reserveData = {
          date: date,
          time: time,
          status: 'pending',
          paid: false,
          userId: userId
        };


        console.log('rserve data is ', reserveData);

        

        try {
          
          const fetchDataReservation = await fetch('/api/reservations',{
            method: 'POST',
            body: JSON.stringify({...reserveData}),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const jsonDataReserve = await fetchDataReservation.json();
          console.log('data to reserve is ', jsonDataReserve);


          const templateParams = {
            from_name: 'From CLinic', 
            to_name: firstName + " " + middleInitial + " " + lastName,
            to_email: email,
            intro_message: "Below is your account",
            message: "Your username: " + data.username + ", password: " + data.passwordText
          };
    
          if(email !== '') {
            await sendEmail(templateParams);
          }

          toast('Generated username and password is sent to your email and contact number: ' + email + ' ' + contactNumber);
          toast('Proceed to login to view appointment status...');

          setTimeout(() => {
            router.push('/login');
          }, 2000);

        } catch(error) {

          console.log(error);

        }
        // try {
        //   const fetchDataPresc = await fetch('/api/userprescriptions',{
        //     method: 'POST',
        //     body: JSON.stringify({prescription: 'Not set', userId: userId}),
        //     headers: {
        //       'Content-Type': 'application/json'
        //     }
        //   });

        //   const jsonDataPresc = await fetchDataPresc.json();

        //   const templateParams = {
        //     from_name: 'From CLinic', 
        //     to_name: name,
        //     to_email: email,
        //     intro_message: "Below is your account",
        //     message: "Your username: " + data.username + ", password: " + data.passwordText
        //   };
    
        //   if(email !== '') {
        //     await sendEmail(templateParams);
        //   }
        

        //   toast('Generated username and password is sent to your email: ' + email);
        //   toast('Check email and proceed to login to view appointment status...');
        //   setTimeout(() => {
        //     router.push('/login');
        //   }, 2000);
          
        // } catch(error) {
        //   console.log(error);
        // }

      } catch(error) {
        console.log(error);
      }
      

    
    } else {
      console.log('There is an empty value');
      toast("All fields except email are required.");

    }


  };

  return (
    <>
      <Head>
        <title>Sepaya Dental Clinic Scheduling System</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <Container>
        <Row>
          <Col xs="12">
            <br />
            <h1>Sepaya Dental Clinic</h1>
            <p><strong>Opening Hours:</strong> Monday to Saturday 8:00 am - 12:00 pm/1:00 pm - 5:00pm</p>
            <br />
          </Col>

          <Col xs="6">
            <div className='items-container'>

              <form>
                
                <div className="form-group withDivs">
                  <div>
                    <p style={{marginBottom: 2}}><label htmlFor="firstName"><strong>First Name</strong>: </label></p>
                    <input className='form-control' type="text" name="firstName" value={firstName} onChange={handleReserveFormInputsChange} />                                                        
                  </div>
                  <div>
                    <p style={{marginBottom: 2}}><label htmlFor="lastName"><strong>Last Name</strong>: </label></p>
                    <input className='form-control' type="text" name="lastName" value={lastName} onChange={handleReserveFormInputsChange} />                                                        
                  </div>
                  <div>
                    <p style={{marginBottom: 2}}><label htmlFor="middleInitial"><strong>Middle Initial</strong>: </label></p>
                    <input className='form-control' type="text" name="middleInitial" value={middleInitial} onChange={handleReserveFormInputsChange} />                                                        
                  </div>
                </div>

                <div className="form-group">
                  <p style={{marginBottom: 2}}><label htmlFor="address"><strong>Patient Address</strong>: </label></p>
                  <input className='form-control' type="text" name="address" value={address} onChange={handleReserveFormInputsChange} />
                </div>

                <div className="form-group withDivs">
                  <div>
                    <p style={{marginBottom: 2}}><label htmlFor="gender"><strong>Gender</strong>: </label></p>
                    <select className='form-control' name="gender" value={gender} onChange={handleReserveFormInputsChange}>
                      <option value=""></option>
                      <option value="Male">Male</option>
                      <option value="Male">Female</option>
                    </select>
                  </div>
                  <div>
                    <p style={{marginBottom: 2}}><label htmlFor="age"><strong>Age</strong>: </label></p>
                    <input className='form-control' type="text" name="age" value={age} onChange={handleReserveFormInputsChange} />
                  </div>
                </div>

   


                <div className="form-group">
                  <p style={{marginBottom: 2}}><label htmlFor="number"><strong>Contact Number</strong>: </label></p>
                  <input className='form-control' type="text" name="contactNumber" value={contactNumber} onChange={handleReserveFormInputsChange} />
                </div>

               

                <div className="form-group">
                  <p style={{marginBottom: 10}}><label htmlFor="email"><strong>Email Address</strong> </label></p>
                  <input className='form-control' type="text" name="email" value={email} onChange={handleReserveFormInputsChange} />
                </div>

                <div className="form-group">
                  <p style={{marginBottom: 10}}><label htmlFor="date"><strong>Select Date</strong>: </label></p>

                  { futureDates &&
                  <NonSSRWrapper>
                    <Calendar 
                      onChange={newDateChange} 
                      value={dateValue} 
                      minDate={new Date(year, month, dayOfTheMonth)}
                      // tileDisabled={disableSunday}
                      // tileContent={sundayText}
                      tileDisabled={disableDateByLimit}
                    />
                  </NonSSRWrapper>

                  }


                </div>

                {
                // <div>
                //   <p style={{marginBottom: 2}}><label htmlFor="gender"><strong>Time</strong>: </label></p>
                //   <select className='form-control' name="time" value={time} onChange={handleReserveFormInputsChange}>
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
                // </div>
                }

                <br />
                
                <p>Do you want to proceed?</p>
                <div className="proceedContainer">
                  <button type='button' className='btn btn-primary' onClick={doReserve}>Yes</button>
                  <button type='button' className='btn btn-secondary' onClick={clearFields}>No</button>
                </div>
                

              </form>
            
            </div>
          </Col>

          <Col xs="6" style={{paddingLeft: '30px'}}  className="position-relative">
            <br />
            <Image
              src={doctorImage}
              alt="Picture of the author"
              priority
            />
          </Col>

          


        </Row>
      </Container>  
      
    
    </>
  )

}

Home.layout = GeneralLayout;
export default Home;