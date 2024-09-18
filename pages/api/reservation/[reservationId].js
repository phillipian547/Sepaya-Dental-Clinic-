import excuteQuery from "../../../lib/db";

/* Database Variables */

// userId, username, password, passwordText, role, patientName, patientAddress, contactNumber, gender, age, emailAddress, date, status

export default async function handler(req, res) {
  
  const reservationId = req.query.reservationId;

  if(req.method === 'GET') {
  
    try {

      const result = await excuteQuery({
        query: 'SELECT * FROM reservations LEFT JOIN users ON reservations.userId = users.userId WHERE reservations.reservationId=?',                                                                 
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


  } else if(req.method === 'POST') {
   
  } else if(req.method === 'PUT') {

    //const reservationId = req.query.reservationId;
    const prescription = req.body.prescription;
    const diagnosis = req.body.diagnosis;
    const paid = req.body.paid;


    try {

      const result = await excuteQuery({
        query: 'UPDATE reservations SET prescription=?, diagnosis=?, paid=? where reservationId=?',                                                                 
        values: [prescription, diagnosis, paid, reservationId]
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
    
  }

}
