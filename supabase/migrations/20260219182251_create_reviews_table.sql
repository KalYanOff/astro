/*
  # Create Reviews Table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `author_name` (text) - Reviewer name
      - `author_avatar` (text) - Avatar URL
      - `rating` (integer) - 1-5 stars
      - `review_text` (text) - Review content
      - `source` (text) - Review source (e.g., "Яндекс.Карты")
      - `is_featured` (boolean) - Show in carousel
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_avatar text DEFAULT '',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  source text DEFAULT 'Яндекс.Карты',
  is_featured boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);