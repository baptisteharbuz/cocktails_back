import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

conn.connect((err) => {
    if (err) {
        console.log(err.stack)
        return
    }
    console.log(conn.threadId)
})

export default conn;