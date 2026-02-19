/*
  # Create FAQ and Booking Tables

  1. New Tables
    - `faq_items`
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text)
      - `category` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    
    - `booking_requests`
      - `id` (uuid, primary key)
      - `check_in_date` (date)
      - `check_out_date` (date)
      - `guests_count` (integer)
      - `wishes` (text)
      - `contact_phone` (text)
      - `contact_name` (text)
      - `room_id` (uuid, nullable)
      - `status` (text)
      - `telegram_sent` (boolean)
      - `created_at` (timestamptz)
    
    - `gallery_images`
      - `id` (uuid, primary key)
      - `image_url` (text)
      - `alt_text` (text)
      - `category` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read for FAQ and gallery
    - Authenticated insert for booking requests
*/

CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  guests_count integer NOT NULL,
  wishes text DEFAULT '',
  contact_phone text DEFAULT '',
  contact_name text DEFAULT '',
  room_id uuid REFERENCES rooms(id),
  status text DEFAULT 'new',
  telegram_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to faq"
  ON faq_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to booking requests"
  ON booking_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read access to gallery"
  ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (true);