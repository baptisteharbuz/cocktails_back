import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './route/router.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/', router);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});