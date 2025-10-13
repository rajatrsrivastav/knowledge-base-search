-- Database Schema for PostgreSQL

-- A simple table for FAQs
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

-- A simple table for PDFs metadata
CREATE TABLE pdfs (
    id SERIAL PRIMARY KEY,
    file_name TEXT NOT NULL
);

-- The main table for our search.
-- It will store text from all sources (FAQs, PDFs, etc.).
CREATE TABLE search_index (
    id SERIAL PRIMARY KEY,
    source_id INT NOT NULL,
    source_type VARCHAR(10) NOT NULL, -- 'faq' or 'pdf'
    title TEXT NOT NULL,
    content TEXT,
    -- This special column is for PostgreSQL's full-text search.
    search_vector TSVECTOR
);

-- Create a GIN index on the search_vector column for high-speed searching.
CREATE INDEX search_index_gin ON search_index USING GIN(search_vector);