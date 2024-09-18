import excuteQuery from "../../../lib/db";

import fetch from 'node-fetch';

const SERVICE_PLAN_ID = '3658ac03bb1b4125a916447026e56f79';
const API_TOKEN = 'c1dab3deb02542e9970efa069a4fb6cb';
const SINCH_NUMBER = '+447537404817';

async function run(number, message) {

  const resp = await fetch(
    'https://us.sms.api.sinch.com/xms/v1/' + SERVICE_PLAN_ID + '/batches',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_TOKEN
      },
      body: JSON.stringify({
        from: SINCH_NUMBER,
        to: [number],
        body: message
      })
    }
  );

  const data = await resp.json();
  console.log(data);
  
}
const setupDate = (dateString) => {
  const dateObj = new Date(dateString);
  //console.log(dateObj);

  const month = dateObj.getMonth() + 1; 
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const date = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);

  return date;

};
/* Database Variables */

// userId, username, password, passwordText, role, patientName, patientAddress, contactNumber, gender, age, emailAddress, date, status

export default async function handler(req, res) {
  
  if(req.method === 'GET') {

  } else if(req.method === 'POST') {

    
    const date = req.body.date;
    const time = req.body.time;
    const status = req.body.status;
    const paid = req.body.paid;
    const userId = req.body.userId;

  
    try {
      const result = await excuteQuery({
        query: 'INSERT INTO reservations (date, time, status, paid, userId) VALUES(?, ?, ?, ?, ?)',                                                                 
        values: [date, time, status, paid, userId]
      });

      const data = {
        success: true,
        data: result 
      };

     
      res.status(200).json(data);
      
    } catch(error) {
    
      const data = {
        success: false,
        data: {}
      };

      res.status(200).json(data);

    }
    
  
  } else if(req.method === 'PUT') {
  

    
    const status = req.body.status;
    const paid = req.body.paid;
    const reservationId = req.body.reservationId;

  
    try {
      const result = await excuteQuery({
        query: 'UPDATE reservations SET status=?, paid=? WHERE reservationId=?',                                                                 
        values: [status, paid, reservationId]
      });

      const data = {
        success: true,
        data: result 
      };

      const message = "Your appointment is approved " + setupDate(req.body.date);

      //const sendText = await run(req.body.contactNumber, message);

      res.status(200).json(data);
      
    } catch(error) {
    
      const data = {
        success: false,
        data: {}
      };

      res.status(200).json(data);

    }

    
  } else if(req.method === 'DELETE') {
    const reservationId = req.body.reservationId;

    try {
      const result = await excuteQuery({
        query: 'DELETE FROM reservations WHERE reservationId=?',                                                                 
        values: [reservationId]
      });

      const data = {
        success: true,
        data: result 
      };

      res.status(200).json(data);
      
    } catch(error) {
    
      const data = {
        success: false,
        data: {}
      };

      res.status(200).json(data);

    }
    
  }

}
