import excuteQuery from "../../../lib/db";

/* Database Variables */

// userId, username, password, passwordText, role, patientName, patientAddress, contactNumber, gender, age, emailAddress, date, status

export default async function handler(req, res) {
  
  if(req.method === 'GET') {

  } else if(req.method === 'POST') {

    const prescription = req.body.prescription;
    const userId = req.body.userId;
    const prescriptionId = req.body.prescriptionId;

    if(!prescriptionId) {
      try {

        const result = await excuteQuery({
          query: 'INSERT INTO prescriptions (prescription, userId) VALUES(?, ?)',                                                                 
          values: [prescription, userId]
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
    } else {
      try {

        const result = await excuteQuery({
          query: 'SELECT * FROM prescriptions WHERE prescriptionId=?',                                                                 
          values: [prescriptionId]
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
   
   
  } else if(req.method === 'PUT') {
    
    const prescriptionId = req.body.prescriptionId;
    const prescription = req.body.prescription;

    try {

      const result = await excuteQuery({
        query: 'UPDATE prescriptions SET prescription=? WHERE prescriptionId=?',                                                                 
        values: [prescription, prescriptionId]
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
