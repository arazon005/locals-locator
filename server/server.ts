/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';
import { json } from 'stream/consumers';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/api/tournaments', async (req, res, next) => {
  try {
    const sql = `
    select *
      from "tournaments"
    `;
    const result = await db.query(sql);
    const tournaments = result.rows;
    res.status(200).json(tournaments);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tournaments/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ClientError(400, '"id" must be a positive integer');
    }
    const sql = `
    select * from "tournaments" where "id"=$1`;
    const params = [id];
    const result = await db.query(sql, params);
    const tournament = result.rows[0];
    if (!tournament) {
      throw new ClientError(404, `Entry with id ${id} not found`);
    }
    res.status(200).json(tournament);
  } catch (err) {
    next(err);
  }
});
/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
