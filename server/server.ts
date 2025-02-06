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
      throw new ClientError(404, `id ${id} not found`);
    }
    res.status(200).json(tournament);
  } catch (err) {
    next(err);
  }
});

app.get('/api/games/:id', async (req, res, next) => {
  try {
    console.log('game query hit');
    const { id } = req.params;
    const sql = `
    select "games"
      from "tournaments"
      where "id"=$1;
    `;
    const params = [id];
    const result = await db.query(sql, params);
    const games = result.rows;
    console.log('game query result.rows: ', games);
    if (!games) {
      throw new ClientError(404, `No games found for id: ${id}`);
    }
    res.status(200).json(games[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/tournaments', async (req, res, next) => {
  try {
    console.log('hit post');
    const { name, address, hours, games, days, notes, lat, lng } = req.body;
    console.log(req.body);
    if (!name || !address || !hours || !lat || !lng) {
      throw new ClientError(400, 'body value(s) are invalid');
    }
    console.log('made it past the body value check');
    const sql = `
  insert into "tournaments" ("name", "address", "hours", "games", "days", "notes", "lat", "lng")
    values ($1, $2, $3, $4, $5, $6, $7, $8)
  returning *;
  `;
    const params = [name, address, hours, games, days, notes, lat, lng];
    const result = await db.query(sql, params);
    const tournament = result.rows[0];
    res.status(201).json(tournament);
  } catch (err) {
    next(err);
  }
});

app.put('/api/tournaments/:id', async (req, res, next) => {
  try {
    console.log('hit put');
    const { name, address, hours, games, notes, lat, lng } = req.body;
    console.log(req.body);
    const { id } = req.params;
    if (!name || !address || !hours || !lat || !lng) {
      throw new ClientError(40, 'body value(s) are invalid');
    }
    console.log('made it past body check');
    if (!Number.isInteger(Number(id))) {
      throw new ClientError(400, `id ${id} not found`);
    }
    console.log('made it past id check');
    const sql = `
  update "tournaments"
    set "name"= $1,
        "address" = $2,
        "hours" = $3,
        "games" = $4,
        "notes" = $5,
        "lat" = $6,
        "lng" = $7
    where "id" = $8
  returning *;
  `;
    const params = [name, address, hours, games, notes, lat, lng, id];
    const result = await db.query(sql, params);
    console.log('made it past query');
    const tournament = result.rows[0];
    if (!tournament) {
      throw new ClientError(400, `id ${id} not found`);
    }
    res.status(200).json(tournament);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/tournaments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new ClientError(400, `Please enter a positive integer`);
    }
    const sql = `
    delete from "tournaments"
      where "id"=$1
      returning*;
    `;
    const params = [id];
    const result = await db.query(sql, params);
    const deleted = result.rows[0];
    if (!deleted) {
      throw new ClientError(400, `id ${id} not found`);
    }
    res.sendStatus(204);
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
