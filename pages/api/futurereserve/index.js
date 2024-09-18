import excuteQuery from "../../../lib/db";
import fetch from 'node-fetch';



/* Database Variables */

// userId, username, password, passwordText, role, patientName, patientAddress, contactNumber, gender, age, emailAddress, date, status

export default async function handler(req, res) {
  
  if(req.method === 'GET') {

    //const role = "user";
    try {

      const result = await excuteQuery({
        query: 'SELECT * FROM reservations WHERE date >= CURDATE() + INTERVAL 1 DAY'                                                                
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

    // const username = req.body.username;
    // const password = req.body.password;
    // const passwordText = req.body.passwordText;
    // const role = req.body.role;
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;
    // const middleInitial = req.body.middleInitial;
    // const patientAddress = req.body.patientAddress;
    // const gender = req.body.gender;
    // const age = req.body.age;
    // const contactNumber = req.body.contactNumber;
    // const emailAddress = req.body.emailAddress;

    // try {

    //   const result = await excuteQuery({
    //     query: 'INSERT INTO users (username, password, passwordText, role, firstName, lastName, middleInitial, patientAddress, contactNumber, gender, age, emailAddress) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',                                                                 
    //     values: [username, password, passwordText, role, firstName, lastName, middleInitial, patientAddress, contactNumber, gender, age, emailAddress]
    //   });

    //   const data = {
    //     success: true,
    //     data: result 
    //   };

    //   // const message = "Username: " + username + " Password: " + passwordText;

    //   // const sendText = await run(contactNumber, message);
    //   //console.log(sendText);

    //   res.status(200).json(data);
      
    // } catch(error) {
      

    //   const data = {
    //     success: false,
    //     data: {}
    //   };

    //   res.status(200).json(data);

    // }
   
  } else if(req.method === 'PUT') {
    
    // const limit = Number(req.body.limit);
    // //console.log(typeof limit);

    // const id = 1;

    // try {

    //   const result = await excuteQuery({
    //     query: 'UPDATE limits SET limitValue=? where id=?',                                                                                  
    //     values: [limit, id]
    //   });

    //   const data = {
    //     success: true,
    //     data: result 
    //   };

    //   res.status(200).json(data);
      
    // } catch(error) {

    //   const data = {
    //     success: false,
    //     data: {}
    //   };

    //   res.status(200).json(data);
    // }    


  } else if(req.method === 'DELETE') {
    
  
  }

}
