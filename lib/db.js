import mysql from 'serverless-mysql';
export const db = mysql({
  // config: {
  //   host: process.env.MYSQL_HOST,
  //   port: process.env.MYSQL_PORT,
  //   database: process.env.MYSQL_DATABASE,
  //   user: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASSWORD
  // }

  config: {
    host: '127.0.0.1',
    port: '3306',
    database: 'clinicreservationnew',
    user: 'root',
    password: ''
  }
});


export default async function excuteQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}