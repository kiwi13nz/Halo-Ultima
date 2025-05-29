/*
  # Add server timestamp function and update triggers

  1. New Functions
    - `get_server_timestamp()`: Helper function for connection testing
    - `update_updated_at_column()`: Trigger function for updating timestamps

  2. Changes
    - Add updated_at triggers to all tables
    - Add connection test function
*/

-- Helper function for connection testing
CREATE OR REPLACE FUNCTION get_server_timestamp()
RETURNS timestamptz
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT NOW();
$$;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_jobs_updated_at'
  ) THEN
    CREATE TRIGGER update_jobs_updated_at
      BEFORE UPDATE ON jobs
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidates_updated_at'
  ) THEN
    CREATE TRIGGER update_candidates_updated_at
      BEFORE UPDATE ON candidates
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_reports_updated_at'
  ) THEN
    CREATE TRIGGER update_reports_updated_at
      BEFORE UPDATE ON reports
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;