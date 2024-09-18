import excuteQuery from "../../../lib/db";

/* Database Variables */

// userId, username, password, passwordText, role, patientName, patientAddress, contactNumber, gender, age, emailAddress, date, status

export default async function handler(req, res) {
  
  const userId = req.query.userId;

  if(req.method === 'GET') {
  
    try {
      const result = await excuteQuery({
        query: 'SELECT * FROM users WHERE users.userId=?',                                                                 
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

  } else if(req.method === 'POST') {
   
  } else if(req.method === 'PUT') {
    
  } else if(req.method === 'DELETE') {
    
  }

}
