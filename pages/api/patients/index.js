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

/* Database Variables */

// userId, username, password, passwordText, role, patientName, patientAddress, contactNumber, gender, age, emailAddress, date, status

export default async function handler(req, res) {
  
  if(req.method === 'GET') {

    //const role = "user";
    try {

      const result = await excuteQuery({
        query: 'SELECT * FROM reservations LEFT JOIN users on reservations.userId = users.userId ORDER BY reservations.date'                                                                
       
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

  } else if(req.method === 'POST') {

    const username = req.body.username;
    const password = req.body.password;
    const passwordText = req.body.passwordText;
    const role = req.body.role;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const middleInitial = req.body.middleInitial;
    const patientAddress = req.body.patientAddress;
    const gender = req.body.gender;
    const age = req.body.age;
    const contactNumber = req.body.contactNumber;
    const emailAddress = req.body.emailAddress;

    try {

      const result = await excuteQuery({
        query: 'INSERT INTO users (username, password, passwordText, role, firstName, lastName, middleInitial, patientAddress, contactNumber, gender, age, emailAddress) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',                                                                 
        values: [username, password, passwordText, role, firstName, lastName, middleInitial, patientAddress, contactNumber, gender, age, emailAddress]
      });

      const data = {
        success: true,
        data: result 
      };

      // const message = "Username: " + username + " Password: " + passwordText;

      // const sendText = await run(contactNumber, message);
      //console.log(sendText);

      res.status(200).json(data);
      
    } catch(error) {
      

      const data = {
        success: false,
        data: {}
      };

      res.status(200).json(data);

    }
   
  } else if(req.method === 'PUT') {
    
    const userId = req.body.userId;
    const username = req.body.username;
    const password = req.body.password;
    const passwordText = req.body.passwordText;
    const role = req.body.role;
    const patientName = req.body.patientName;
    const patientAddress = req.body.patientAddress;
    const contactNumber = req.body.contactNumber;
    const gender = req.body.gender;
    const age = req.body.age;
    const emailAddress = req.body.emailAddress;
    const date = req.body.date;
    const status = req.body.status;

    try {

      const result = await excuteQuery({
        query: 'UPDATE users SET patientName=?, patientAddress=?, contactNumber=?, gender=?, age=?, emailAddress=?, date=?, status=?  WHERE userId = ?',                                                                                  
        values: [patientName, patientAddress, contactNumber, gender, age, emailAddress, date, status, userId]
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


  } else if(req.method === 'DELETE') {
    
    const userId = req.body.userId;

    try {

      const result = await excuteQuery({
        query: 'DELETE FROM users WHERE userId = ?',
        values: [userId]
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
