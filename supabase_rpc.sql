-- Create the steal_points function
CREATE OR REPLACE FUNCTION steal_points(stealer_id uuid, target_id uuid, amount integer)
RETURNS void AS $$
BEGIN
  -- 1. Deduct from target ONLY if they are not shielded
  UPDATE players 
  SET score = GREATEST(0, score - amount)
  WHERE id = target_id AND is_shielded = false;

  -- 2. Add to stealer IF target was NOT shielded (meaning deduction happened)
  -- We check if target still has shield OR we could use a better check
  -- Simple version: Just add to stealer if the target deduction was successful
  -- Note: We assume amount is valid.
  UPDATE players
  SET score = score + amount
  WHERE id = stealer_id AND EXISTS (
    SELECT 1 FROM players WHERE id = target_id AND is_shielded = false
  );

  -- 3. Consume shield if they were shielded
  UPDATE players
  SET is_shielded = false
  WHERE id = target_id AND is_shielded = true;
END;
$$ LANGUAGE plpgsql;

-- To be run in Supabase SQL Editor
