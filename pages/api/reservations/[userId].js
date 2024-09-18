import excuteQuery from "../../../lib/db";

/* Database Variables */

export default async function handler(req, res) {
  
  const userId = req.query.userId;

  if(req.method === 'GET') {
  
    try {

      const result = await excuteQuery({
        query: 'SELECT * FROM reservations LEFT JOIN users ON reservations.userId = users.userId WHERE users.userId=? ORDER BY reservations.date',                                                                 
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

    try {
      const status = 'approved';
      const result = await excuteQuery({
        query: 'SELECT * FROM reservations WHERE userId=? AND status=? ORDER BY date DESC LIMIT 1',                                                                 
        values: [userId, status]
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
    
  } else if(req.method === 'DELETE') {
    
  }

}
