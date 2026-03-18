-- Create the steal_points function
CREATE OR REPLACE FUNCTION steal_points(stealer_id uuid, target_id uuid, amount integer)
RETURNS void AS $$
BEGIN
  -- 1. Deduct from target ONLY if they are not shielded
  UPDATE players 
  SET score = GREATEST(0, score - amount)
  WHERE id = target_id AND is_shielded = false;

  -- 2. Consume shield if they were shielded
  UPDATE players
  SET is_shielded = false
  WHERE id = target_id AND is_shielded = true;
END;
$$ LANGUAGE plpgsql;

-- To be run in Supabase SQL Editor
