/*
  # Create Hotel Rooms Table

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text) - Room name
      - `category` (text) - econom or standard
      - `capacity` (integer) - 2, 3, or 4 guests
      - `base_price` (integer) - Price per night in rubles
      - `amenities` (jsonb) - List of amenities
      - `images` (text[]) - Array of image URLs
      - `description` (text) - Room description
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `rooms` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('econom', 'standard')),
  capacity integer NOT NULL CHECK (capacity IN (2, 3, 4)),
  base_price integer NOT NULL,
  amenities jsonb DEFAULT '[]'::jsonb,
  images text[] DEFAULT ARRAY[]::text[],
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to rooms"
  ON rooms
  FOR SELECT
  TO anon, authenticated
  USING (true);