import 'dotenv/config';
import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';
import knex from 'knex';

const { json } = pkg;
const app = express();
const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});

app.use(cors());
app.use(json());

app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  try {
    await db('users').insert({ username, password });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
