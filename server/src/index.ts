import express, { type Request, type Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { Pool } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'search_db',
        password: process.env.DB_PASSWORD || 'password',
        port: parseInt(process.env.DB_PORT || '5432'),
      }
);
const upload = multer({ dest: 'uploads/' });

app.get('/',(req,res)=>{
  res.json("Server is active")
})

app.get('/api/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const searchQuery = `
      SELECT
          title,
          source_type,
          ts_rank(search_vector, plainto_tsquery('english', $1)) AS relevance
      FROM
          search_index
      WHERE
          search_vector @@ plainto_tsquery('english', $1)
      ORDER BY
          relevance DESC
      LIMIT 10;
    `;

    const { rows } = await pool.query(searchQuery, [query]);
    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

app.post('/api/faqs', async (req: Request, res: Response) => {
  const { question, answer } = req.body;

  try {
    const faqResult = await pool.query(
      'INSERT INTO faqs (question, answer) VALUES ($1, $2) RETURNING id',
      [question, answer]
    );
    const faqId = faqResult.rows[0].id;

    const searchResult = await pool.query(
      `INSERT INTO search_index (source_id, source_type, title, content)
       VALUES ($1, 'faq', $2, $3) RETURNING id`,
      [faqId, question, answer]
    );
    const searchId = searchResult.rows[0].id;
    
    await pool.query(
      `UPDATE search_index SET search_vector = to_tsvector('english', title || ' ' || content)
       WHERE id = $1`,
      [searchId]
    );

    res.status(201).json({ message: 'FAQ added successfully.' });
  } catch (error) {
    console.error('FAQ creation error:', error);
    res.status(500).json({ message: 'Failed to add FAQ' });
  }
});

app.get('/api/faqs', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM faqs ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: 'Failed to get FAQs' });
  }
});

app.post('/api/pdfs', upload.single('file'), async (req: Request, res: Response) => {
  const { title } = req.body;
  const file = req.file;

  if (!file || !title) {
    return res.status(400).json({ message: 'File and title are required' });
  }

  try {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    const content = data.text;

    const pdfResult = await pool.query(
      'INSERT INTO pdfs (file_name) VALUES ($1) RETURNING id',
      [file.originalname]
    );
    const pdfId = pdfResult.rows[0].id;

    const searchResult = await pool.query(
      `INSERT INTO search_index (source_id, source_type, title, content)
       VALUES ($1, 'pdf', $2, $3) RETURNING id`,
      [pdfId, title, content]
    );
    const searchId = searchResult.rows[0].id;

    await pool.query(
      `UPDATE search_index SET search_vector = to_tsvector('english', title || ' ' || content)
       WHERE id = $1`,
      [searchId]
    );

    fs.unlinkSync(file.path);

    res.status(201).json({ message: 'PDF added successfully.' });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ message: 'Failed to upload PDF' });
  }
});

app.get('/api/pdfs', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM pdfs ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get PDFs error:', error);
    res.status(500).json({ message: 'Failed to get PDFs' });
  }
});

app.post('/api/links', async (req: Request, res: Response) => {
  const { title, url, description } = req.body;

  try {
    const searchResult = await pool.query(
      `INSERT INTO search_index (source_id, source_type, title, content)
       VALUES ($1, 'link', $2, $3) RETURNING id`,
      [0, title, `${description || ''} ${url}`]
    );
    const searchId = searchResult.rows[0].id;
    
    await pool.query(
      `UPDATE search_index SET search_vector = to_tsvector('english', title || ' ' || content)
       WHERE id = $1`,
      [searchId]
    );

    res.status(201).json({ message: 'Link added successfully.' });
  } catch (error) {
    console.error('Link creation error:', error);
    res.status(500).json({ message: 'Failed to add Link' });
  }
});

app.get('/api/links', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT id, title, content FROM search_index WHERE source_type = 'link' ORDER BY id DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error('Get Links error:', error);
    res.status(500).json({ message: 'Failed to get Links' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;